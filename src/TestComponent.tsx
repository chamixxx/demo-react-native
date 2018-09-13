import { injectIntl, InjectedIntlProps, InjectedIntl } from "react-intl";

import * as React from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

//nameForm.tsx
interface TestProps {
  extraProps: string;
}

class Test extends React.Component<TestProps & InjectedIntlProps, {}> {
  render() {
    let placeHolder = this.props.intl.formatMessage({
      id: "test",
      defaultMessage: "name"
    });
    const demo = this.props.extraProps;

    return (
      <Text>
        {placeHolder}
        {demo}
      </Text>
    );
  }
}
export default injectIntl(Test);
