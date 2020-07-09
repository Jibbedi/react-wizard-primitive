import React from "react";
import {
  UseWizard,
  OnChangeHandler,
  useWizard,
  WizardContext,
  Step,
  useWizardStep,
} from "./hooks";

export interface WizardProps {
  children: ((useWizard: UseWizard) => React.ReactNode) | React.ReactNode;
  initialStepIndex?: number;
  onChange?: OnChangeHandler;
}

export const Wizard: React.FC<WizardProps> = (props: WizardProps) => {
  const internalState = useWizard({
    initialStepIndex: props.initialStepIndex,
    onChange: props.onChange,
  });

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
  routeTitle?: string;
}

export const WizardStep: React.FC<WizardStepProps> = (
  props: WizardStepProps
) => {
  return props.children(useWizardStep({ routeTitle: props.routeTitle }));
};
