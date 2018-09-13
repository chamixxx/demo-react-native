#!/bin/bash

SOURCE_CODE_DIR="./src/"
LOCALE_DIR="./locale/"

LOCALE_FILES=( \
    'en.json' \
    'de.json' \
)

PATTERNS=( \
    '^ *<FormattedMessage .*id=".*?"' \
    '^.* { .*id: ".*?"' \
    '^ *id = ".*?"' \
    '^ *id: ".*?"' \
)

PATTERNS_TO_STRIP=( \
    '<FormattedMessage .*id=' \
    '^.* { .*id: ' \
    'id = ' \
    'id: ' \
    '"' \
)

function r() { 
    lines=`egrep -ho "$1" ${@:2} -R . `
    for stripstring in "${PATTERNS_TO_STRIP[@]}" ; do
        lines=`echo "${lines}" | sed -e "s/$stripstring//g"`
    done
    echo "${lines}"
}

cd $SOURCE_CODE_DIR
pwd

keys=""

for pattern in "${PATTERNS[@]}" ; do
    echo "Checking for pattern: $pattern"
    keys="$keys
`r "$pattern"`"
done


echo
echo "Done checking, these keys were found:"
unsorted_keys=(`echo "${keys}" | tail -n +2 | sort | uniq`)
IFS=$'\n' keys=($(sort <<<"${unsorted_keys[*]}"))
unset IFS
echo "${keys[@]}"
echo
cd ".."
cd "$LOCALE_DIR"
pwd

for locale in "${LOCALE_FILES[@]}" ; do
    echo
    echo "Comparing to locale file: $locale, these keys were found to be missing and added:"
    for key in "${keys[@]}" ; do
        python -c "
import sys, json
with open('""${locale}""', 'r+') as f:
    f.seek(1)
    content = f.read()
    f.seek(0)
    try:
        json.load(f)['""${key}""']
    except KeyError:
        print '"${key}"'
        f.seek(1)
        f.write('\n  \"""${key}""\": \"\",' + content)
"
    done
    echo "{" > ${locale}_sorted
    tail -n +2 ${locale} | sed \$d >> ${locale}_sorted
    echo "}" >> ${locale}_sorted
    mv ${locale}_sorted ${locale}
done

echo
echo "Done. If you want to upload the newly generated keys to PhraseApp as missing translations, execute 'phraseapp push'."
