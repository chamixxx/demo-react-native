import { TrackingType, TrackingTypesEnum } from "./TrackingUtils";

export interface IntlMessageContent {
  id: string;
  defaultMessage: string;
}

export namespace TrackingSliderTextArray {
  export const waterTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.water.iHadOne",
      defaultMessage: "I had one glass of water"
    },
    {
      id: "addtracking.water.iHadTwo",
      defaultMessage: "I had two glasses of water"
    },
    {
      id: "addtracking.water.iHadThree",
      defaultMessage: "I had three glasses of water"
    },
    {
      id: "addtracking.water.iHadFour",
      defaultMessage: "I had four glasses of water"
    },
    {
      id: "addtracking.water.iHadFive",
      defaultMessage: "I had five glasses of water"
    }
  ];

  export const tummyPainTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.tummyPain.iHaveNo",
      defaultMessage: "I have no tummy pain at all"
    },
    {
      id: "addtracking.tummyPain.iHaveMild",
      defaultMessage: "I have mild tummy pain"
    },
    {
      id: "addtracking.tummyPain.iHaveModerate",
      defaultMessage: "I have moderate tummy pain"
    },
    {
      id: "addtracking.tummyPain.iHaveSevere",
      defaultMessage: "I have severe tummy pain"
    },
    {
      id: "addtracking.tummyPain.iHaveExtreme",
      defaultMessage: "I have extreme tummy pain"
    }
  ];

  export const bloatingTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.bloating.iDontFeel",
      defaultMessage: "I don't feel bloated at all"
    },
    {
      id: "addtracking.bloating.iHaveMild",
      defaultMessage: "I have a mild feeling of bloating"
    },
    {
      id: "addtracking.bloating.iHaveModerate",
      defaultMessage: "I have a moderate feeling of bloating"
    },
    {
      id: "addtracking.bloating.iHaveSevere",
      defaultMessage: "I have a severe feeling of bloating"
    },
    {
      id: "addtracking.bloating.iHaveExtreme",
      defaultMessage: "I have an extreme feeling of bloating"
    }
  ];

  export const moodTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.mood.iFeelVeryGood",
      defaultMessage: "I feel very good"
    },
    {
      id: "addtracking.mood.iFeelGood",
      defaultMessage: "I feel good"
    },
    {
      id: "addtracking.mood.iFeelSoSo",
      defaultMessage: "I feel so-so"
    },
    {
      id: "addtracking.mood.iDontFeelGood",
      defaultMessage: "I don't feel good"
    },
    {
      id: "addtracking.mood.iFeelAwful",
      defaultMessage: "I feel awful"
    }
  ];

  export const stressTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.stressLong.iDontFeel",
      defaultMessage: "I don't feel stressed at all"
    },
    {
      id: "addtracking.stressLong.iFeelLittle",
      defaultMessage: "I feel a little stressed"
    },
    {
      id: "addtracking.stressLong.iFeelSomewhat",
      defaultMessage: "I feel somewhat stressed"
    },
    {
      id: "addtracking.stressLong.iFeelReally",
      defaultMessage: "I feel really stressed"
    },
    {
      id: "addtracking.stressLong.iFeelExtremely",
      defaultMessage: "I feel extremely stressed"
    }
  ];

  export const periodTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.period.iAmNot",
      defaultMessage: "I am not on my period"
    },
    {
      id: "addtracking.period.iAmLight",
      defaultMessage: "I am on my period, light bleeding"
    },
    {
      id: "addtracking.period.iAmMedium",
      defaultMessage: "I am on my period, medium bleeding"
    },
    {
      id: "addtracking.period.iAmHeavy",
      defaultMessage: "I am on my period, heavy bleeding"
    }
  ];

  export const workoutTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.workout.iDidEasy",
      defaultMessage: "I did an easy workout"
    },
    {
      id: "addtracking.workout.iDidMedium",
      defaultMessage: "I did a medium workout"
    },
    {
      id: "addtracking.workout.iDidHard",
      defaultMessage: "I did a hard workout"
    }
  ];

  export const sleepTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.sleep.iSleptForLess2",
      defaultMessage: "I slept for less than 2 hours"
    },
    {
      id: "addtracking.sleep.iSleptFor2t4",
      defaultMessage: "I slept for 2 to 4 hours"
    },
    {
      id: "addtracking.sleep.iSleptFor4t6",
      defaultMessage: "I slept for 4 to 6 hours"
    },
    {
      id: "addtracking.sleep.iSleptFor6t8",
      defaultMessage: "I slept for 6 to 8 hours"
    },
    {
      id: "addtracking.sleep.iSleptForMore8",
      defaultMessage: "I slept for more than 8 hours"
    }
  ];

  export const headacheTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.headache.iDontHave",
      defaultMessage: "I don't have any headache"
    },
    {
      id: "addtracking.headache.iHaveMild",
      defaultMessage: "I have a mild headache"
    },
    {
      id: "addtracking.headache.iHaveModerate",
      defaultMessage: "I have a moderate headache"
    },
    {
      id: "addtracking.headache.iHaveSevere",
      defaultMessage: "I have a severe headache"
    },
    {
      id: "addtracking.headache.iHaveExtreme",
      defaultMessage: "I have an extreme headache"
    }
  ];

  export const otherPainTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.otherpain.iHaveNo",
      defaultMessage: "I have no further pain at all"
    },
    {
      id: "addtracking.otherpain.iHaveMild",
      defaultMessage: "I have mild pain"
    },
    {
      id: "addtracking.otherpain.iHaveModerate",
      defaultMessage: "I have moderate pain"
    },
    {
      id: "addtracking.otherpain.iHaveSevere",
      defaultMessage: "I have severe pain"
    },
    {
      id: "addtracking.otherpain.iHaveExtreme",
      defaultMessage: "I have extreme pain"
    }
  ];

  export const stoolTextArray: IntlMessageContent[] = [
    {
      id: "addtracking.stool.nothing",
      defaultMessage: "Nothing"
    },
    {
      id: "addtracking.stool.separateHardLumps",
      defaultMessage: "Separate hard lumps"
    },
    {
      id: "addtracking.stool.lumpyAndSausageLike",
      defaultMessage: "Lumpy and sausage-like"
    },
    {
      id: "addtracking.stool.sausageShape",
      defaultMessage: "Sausage shape with cracks in the surface"
    },
    {
      id: "addtracking.stool.perfectlySmooth",
      defaultMessage: "Perfectly smooth, soft sausage"
    },
    {
      id: "addtracking.stool.softBlobs",
      defaultMessage: "Soft blobs with clear-cut edges"
    },
    {
      id: "addtracking.stool.mushyConsistency",
      defaultMessage: "Mushy consistency with ragged edges"
    },
    {
      id: "addtracking.stool.liquidConsistency",
      defaultMessage: "Liquid consistency with no solid pieces"
    }
  ];

  export function trackingTextArrayFromTrackingType(
    trackingType: TrackingType
  ): IntlMessageContent[] {
    switch (trackingType) {
      case TrackingTypesEnum.additionalSymptomsType:
        return [];
      case TrackingTypesEnum.bloatingType:
        return bloatingTextArray;
      case TrackingTypesEnum.foodType:
        return [];
      case TrackingTypesEnum.headacheType:
        return headacheTextArray;
      case TrackingTypesEnum.medicationsType:
        return [];
      case TrackingTypesEnum.medicationsType2:
        return [];
      case TrackingTypesEnum.moodType:
        return moodTextArray;
      case TrackingTypesEnum.notesType:
        return [];
      case TrackingTypesEnum.otherPainType:
        return otherPainTextArray;
      case TrackingTypesEnum.periodType:
        return periodTextArray;
      case TrackingTypesEnum.skinType:
        return [];
      case TrackingTypesEnum.sleepType:
        return sleepTextArray;
      case TrackingTypesEnum.stoolType:
        return stoolTextArray;
      case TrackingTypesEnum.stressType:
        return stressTextArray;
      case TrackingTypesEnum.tummyPainType:
        return tummyPainTextArray;
      case TrackingTypesEnum.waterType:
        return waterTextArray;
      case TrackingTypesEnum.workoutType:
        return workoutTextArray;
    }
  }

  export function trackingQuestionString(
    trackingType: TrackingType
  ): IntlMessageContent {
    switch (trackingType) {
      case TrackingTypesEnum.additionalSymptomsType:
        return {
          id: "addtracking.additionalsymptoms.addAnyAdditionalSymptoms",
          defaultMessage: "Add any additional symptoms"
        };
      case TrackingTypesEnum.bloatingType:
        return {
          id: "addtracking.bloating.howBloated?",
          defaultMessage: "How bloated do you feel?"
        };
      case TrackingTypesEnum.foodType:
        return {
          id: "addtracking.food.whatDidYouEat",
          defaultMessage: "What did you eat?"
        };
      case TrackingTypesEnum.headacheType:
        return {
          id: "addtracking.headache.doYouHave?",
          defaultMessage: "Do you have a headache?"
        };
      case TrackingTypesEnum.medicationsType:
        return {
          id: "addtracking.medications.addTheMedicationsYouTook",
          defaultMessage: "Track your medication"
        };
      case TrackingTypesEnum.medicationsType2:
        return {
          id: "addtracking.medications.addTheMedicationsYouTook",
          defaultMessage: "Track your medication"
        };
      case TrackingTypesEnum.moodType:
        return {
          id: "addtracking.mood.whatIs?",
          defaultMessage: "What is your mood?"
        };
      case TrackingTypesEnum.notesType:
        return {
          id: "addtracking.notes.addFurtherNotes",
          defaultMessage: "Add further notes"
        };
      case TrackingTypesEnum.otherPainType:
        return {
          id: "addtracking.otherpain.doYouExperience?",
          defaultMessage: "Do you experience any other pain?"
        };
      case TrackingTypesEnum.periodType:
        return {
          id: "addtracking.period.areYouOn?",
          defaultMessage: "Are you on your period?"
        };
      case TrackingTypesEnum.skinType:
        return {
          id: "addtracking.skin.whatIsCondition?",
          defaultMessage: "What is the condition of your skin?"
        };
      case TrackingTypesEnum.sleepType:
        return {
          id: "addtracking.sleep.howLong?",
          defaultMessage: "How long did you sleep?"
        };
      case TrackingTypesEnum.stoolType:
        return {
          id: "addtracking.stool.getToKnowYourGutAndTrackYourStool",
          defaultMessage: "Get to know your gut and track your poop!"
        };
      case TrackingTypesEnum.stressType:
        return {
          id: "addtracking.stress.whatIs?",
          defaultMessage: "What is your stress level?"
        };
      case TrackingTypesEnum.tummyPainType:
        return {
          id: "addtracking.tummyPain.howMuch?",
          defaultMessage: "How much tummy pain do you feel?"
        };
      case TrackingTypesEnum.waterType:
        return {
          id: "addtracking.water.howMany?",
          defaultMessage: "How many glasses of water did you have?"
        };
      case TrackingTypesEnum.workoutType:
        return {
          id: "addtracking.workout.whatWasLike?",
          defaultMessage: "What was your workout like?"
        };
    }
  }
}

export function iconOverviewPickerActiveFromTrackingType(
  trackingType: TrackingType
): any {
  switch (trackingType) {
    case TrackingTypesEnum.foodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewFoodActive.png");
    case TrackingTypesEnum.waterType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewWaterActive.png");
    case TrackingTypesEnum.stoolType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewPoopActive.png");
    case TrackingTypesEnum.tummyPainType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewTummyPainActive.png");
    case TrackingTypesEnum.bloatingType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewBloatingActive.png");
    case TrackingTypesEnum.moodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMoodActive.png");
    case TrackingTypesEnum.stressType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewStressActive.png");
    case TrackingTypesEnum.periodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewPeriodActive.png");
    case TrackingTypesEnum.skinType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewSkinActive.png");
    case TrackingTypesEnum.workoutType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewWorkoutActive.png");
    case TrackingTypesEnum.sleepType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewSleepActive.png");
    case TrackingTypesEnum.headacheType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewHeadacheActive.png");
    case TrackingTypesEnum.otherPainType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewOtherpainActive.png");
    case TrackingTypesEnum.medicationsType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMedsActive.png");
    case TrackingTypesEnum.medicationsType2:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMedsActive.png");
    case TrackingTypesEnum.notesType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewNotesActive.png");
    case TrackingTypesEnum.additionalSymptomsType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewAdditionalActive.png");
  }
}

export function iconOverviewPickerInactiveFromTrackingType(
  trackingType: TrackingType
): any {
  switch (trackingType) {
    case TrackingTypesEnum.foodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewFoodInactive.png");
    case TrackingTypesEnum.waterType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewWaterInactive.png");
    case TrackingTypesEnum.stoolType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewPoopInactive.png");
    case TrackingTypesEnum.tummyPainType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewTummyPainInactive.png");
    case TrackingTypesEnum.bloatingType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewBloatingInactive.png");
    case TrackingTypesEnum.moodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMoodInactive.png");
    case TrackingTypesEnum.stressType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewStressInactive.png");
    case TrackingTypesEnum.periodType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewPeriodInactive.png");
    case TrackingTypesEnum.skinType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewSkinInactive.png");
    case TrackingTypesEnum.workoutType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewWorkoutInactive.png");
    case TrackingTypesEnum.sleepType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewSleepInactive.png");
    case TrackingTypesEnum.headacheType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewHeadacheInactive.png");
    case TrackingTypesEnum.otherPainType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewOtherpainInactive.png");
    case TrackingTypesEnum.medicationsType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMedsInactive.png");
    case TrackingTypesEnum.medicationsType2:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewMedsInactive.png");
    case TrackingTypesEnum.notesType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewNotesInactive.png");
    case TrackingTypesEnum.additionalSymptomsType:
      return require("../../Overviews/Images/TrackingIconForPicker/iCNOverviewAdditionalInactive.png");
  }
}
