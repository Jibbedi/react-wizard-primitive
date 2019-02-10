import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { addHashChangeListener, getRoutingHash, removeHashChangeListener, setRoutingHash } from "./routing";

export interface GetStepOptions {
  routeTitle?: string;
}

export interface UseWizard {
  activeStepIndex: number;
  maxVisitedStepIndex: number;
  goToStep: (stepIndex: number) => void;
  moveToStep: (stepIndex: number) => void;
  resetToStep: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  getStep: (options?: GetStepOptions) => Step;
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

  // each getStep call with add the corresponding step title or undefined if none is provided
  const stepTitles: (string | undefined)[] = [];

  // each getStep call will increase the counter by one
  let stepCheckIndex = 0;

  useEffect(() => {
    const goToNewStepIndexForRoutingHash = () => {
      const hash = getRoutingHash();
      const newStepIndex = stepTitles.indexOf(hash);
      if (newStepIndex >= 0) {
        goToStep(newStepIndex);
      }
    };

    // check route initially
    goToNewStepIndexForRoutingHash();

    // setup event listener for changed made to the url
    const handleHashChange = () => {
      goToNewStepIndexForRoutingHash();
    };

    addHashChangeListener(handleHashChange);
    return () => removeHashChangeListener(handleHashChange);
  }, []);

  // update location hash
  useEffect(() => {
    const stepsWithTitle = stepTitles.filter(title => !!title);
    const allStepTitlesAvailable = stepsWithTitle.length === stepCheckIndex - 1;
    const allStepTitlesMissing = stepsWithTitle.length === 0;

    if (allStepTitlesAvailable) {
      const stepTitle = stepTitles[activeStepIndex]!;
      setRoutingHash(stepTitle);
      return;
    }

    if (!allStepTitlesMissing) {
      const indicesOfMissingTitles = stepTitles
        .map((title, index) => (!title ? index : null))
        .filter(title => !!title);

      console.warn(
        `You have not specified a title for the steps with the indices: ${indicesOfMissingTitles.join(
          ","
        )}`
      );

      return;
    }
  }, [activeStepIndex]);

  const getStep: (options?: GetStepOptions) => Step = ({
    routeTitle
  }: GetStepOptions = {}) => {
    const stepIndex = stepCheckIndex;

    stepTitles.push(routeTitle);

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

  const goToStep = (stepIndex: number, { resetMaxStepIndex = false } = {}) => {
    if (activeStepIndex !== stepIndex) {
      setActiveStepIndex(stepIndex);
      setMaxVisitedStepIndex(
        resetMaxStepIndex ? stepIndex : Math.max(stepIndex, maxVisitedStepIndex)
      );
    }
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

  const contextRef = useRef<UseWizard | null>(null);
  const stepRef = useRef<Step | null>(null);

  /* 
  We have to reuse the step information if the context has not change,
  because otherwise getStep would return information about a newly created, and therefore wrong step.
  Any changes to the wizard state will cause a new context.
   */

  if (contextRef.current !== wizardContext) {
    contextRef.current = wizardContext;
    stepRef.current = wizardContext.getStep();
  }

  return props.children(stepRef.current!);
};

export default Wizard;
