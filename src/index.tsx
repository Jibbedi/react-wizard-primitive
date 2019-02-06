import React, { FunctionComponent, useContext, useState } from "react";

export interface UseWizard {
  activeStepIndex: number;
  maxVisitedStepIndex: number;
  goToStep: (stepIndex: number) => void;
  moveToStep: (stepIndex: number) => void;
  resetToStep: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  getStep: () => Step;
}

export interface Step {
  index: number;
  isActive: boolean;
  hasBeenActive: boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetToStep: () => void;
  moveToStep: () => void;
}

const WizardContext = React.createContext<UseWizard | null>(null);

export const useWizard = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [maxVisitedStepIndex, setMaxVisitedStepIndex] = useState(0);

  const goToStep = (stepIndex: number, { resetMaxStepIndex = false } = {}) => {
    setActiveStepIndex(stepIndex);
    setMaxVisitedStepIndex(
      resetMaxStepIndex ? stepIndex : Math.max(stepIndex, maxVisitedStepIndex)
    );
  };

  const nextStep = () => {
    goToStep(activeStepIndex + 1);
  };

  const previousStep = () => {
    goToStep(Math.max(activeStepIndex - 1, 0));
  };

  const moveToStep = (stepIndex: number) => {
    goToStep(stepIndex);
  };

  const resetToStep = (stepIndex: number) => {
    goToStep(stepIndex, { resetMaxStepIndex: true });
  };

  let stepCheckIndex = 0;
  const getStep: () => Step = () => {
    const stepIndex = stepCheckIndex;

    const stepState = {
      index: stepIndex,
      isActive: activeStepIndex === stepCheckIndex,
      hasBeenActive: maxVisitedStepIndex >= stepCheckIndex,
      nextStep: () => goToStep(stepIndex + 1),
      previousStep: () => goToStep(Math.max(stepIndex - 1, 0)),
      resetToStep: () => goToStep(stepIndex, { resetMaxStepIndex: true }),
      moveToStep: () => goToStep(stepIndex)
    };
    stepCheckIndex++;
    return stepState;
  };

  return {
    activeStepIndex,
    maxVisitedStepIndex,
    goToStep,
    nextStep,
    previousStep,
    getStep,
    moveToStep,
    resetToStep
  };
};

export interface WizardProps {
  children: ((useWizard: UseWizard) => React.ReactNode) | React.ReactNode;
}

export const Wizard: FunctionComponent<WizardProps> = (props: WizardProps) => {
  const internalState = useWizard();
  return (
    <WizardContext.Provider value={{ ...internalState }}>
      {typeof props.children === "function"
        ? props.children(internalState)
        : props.children}
    </WizardContext.Provider>
  );
};

export interface WizardStepProps {
  children: (step: Step) => React.ReactNode | any;
}

export const WizardStep: FunctionComponent<WizardStepProps> = (
  props: WizardStepProps
) => {
  const wizardContext = useContext(WizardContext);

  if (wizardContext === null) {
    throw new Error(
      "Wizard Step must be used as a child within a Wizard Component"
    );
  }

  return props.children(wizardContext.getStep());
};

export default Wizard;
