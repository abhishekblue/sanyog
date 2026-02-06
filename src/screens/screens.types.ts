export interface IWelcomeScreenProps {
  onGetStarted: () => void;
}

export interface IBasicInfoScreenProps {
  onContinue: () => void;
}

export interface IAssessmentScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export interface IProcessingScreenProps {
  onComplete: () => void;
}

export interface IResultsScreenProps {
  onContinue: () => void;
}

export interface ISettingsScreenProps {
  onRetakeAssessment: () => void;
}
