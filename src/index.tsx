import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getRoutingHash, setRoutingHash } from "./routing";

export interface GetStepOptions {
  routeTitle?: string;
}

export interface StepNavigationOptions {
  skipOnChangeHandler?: boolean;
}

// Only used for internal state handling and not exposed to public
interface InternalGoToStepOptions {
  resetMaxStepIndex?: boolean;
}

// Merge internal API and public API together to be passed as options to internal goToStep function
type GoToStepOptions = InternalGoToStepOptions & StepNavigationOptions;

export interface UseWizard {
  activeStepIndex: number;
  maxActivatedStepIndex: number;
  goToStep: (stepIndex: number, options?: StepNavigationOptions) => void;
  moveToStep: (stepIndex: number, options?: StepNavigationOptions) => void;
  resetToStep: (stepIndex: number, options?: StepNavigationOptions) => void;
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

type OnChangeHandler = (props: {
  newStepIndex: number;
  previousStepIndex: number;
  maxActivatedStepIndex: number;
}) => void;

type GoToStep = (stepIndex: number, options?: GoToStepOptions) => void;

export interface UseWizardProps {
  initialStepIndex?: number;
  onChange?: OnChangeHandler;
}

const WizardContext = React.createContext<UseWizard | null>(null);

export const useWizard = ({
  initialStepIndex = 0,
  onChange,
}: UseWizardProps = {}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialStepIndex);
  const [maxActivatedStepIndex, setMaxActivatedStepIndex] = useState(
    initialStepIndex - 1
  );

  // each getStep call with add the corresponding step title or undefined if none is provided
  const stepTitles: (string | undefined)[] = [];

  // each getStep call will increase the counter by one
  let stepCheckIndex = 0;

  useEffect(() => {
    const hash = getRoutingHash();
    const newStepIndex = stepTitles.indexOf(hash);
    if (newStepIndex >= 0) {
      goToStep(newStepIndex);
    }
  }, []);

  // update location hash
  useEffect(() => {
    /*
      return early if no step has been created
    */
    if (stepCheckIndex === 0) {
      return;
    }

    const stepsWithTitle = stepTitles.filter((title) => !!title);
    const allStepTitlesAvailable = stepsWithTitle.length === stepCheckIndex;
    const allStepTitlesMissing = stepsWithTitle.length === 0;

    if (allStepTitlesAvailable) {
      const stepTitle = stepTitles[activeStepIndex]!;
      setRoutingHash(stepTitle);
      return;
    }

    if (!allStepTitlesMissing) {
      const indicesOfMissingTitles = stepTitles
        .map((title, index) => (!title ? index : null))
        .filter((title) => title !== null);

      console.warn(
        `You have not specified a title for the steps with the indices: ${indicesOfMissingTitles.join(
          ", "
        )}`
      );

      return;
    }
  }, [activeStepIndex]);

  const getStep: (options?: GetStepOptions) => Step = ({
    routeTitle,
  }: GetStepOptions = {}) => {
    const stepIndex = stepCheckIndex;

    stepTitles.push(routeTitle);

    const stepState = {
      index: stepIndex,
      isActive: activeStepIndex === stepCheckIndex,
      hasBeenActive: maxActivatedStepIndex >= stepCheckIndex,
      nextStep: () => goToStep(stepIndex + 1),
      previousStep: () => goToStep(Math.max(stepIndex - 1, 0)),
      resetToStep: () => goToStep(stepIndex, { resetMaxStepIndex: true }),
      moveToStep: () => goToStep(stepIndex),
    };
    stepCheckIndex++;
    return stepState;
  };

  const goToStep: GoToStep = (
    stepIndex: number,
    {
      resetMaxStepIndex = false,
      skipOnChangeHandler = false,
    }: GoToStepOptions = {}
  ) => {
    if (activeStepIndex !== stepIndex) {
      const newMaxStepIndex = resetMaxStepIndex
        ? stepIndex - 1
        : Math.max(activeStepIndex, maxActivatedStepIndex);

      if (onChange && !skipOnChangeHandler) {
        onChange({
          previousStepIndex: activeStepIndex,
          newStepIndex: stepIndex,
          maxActivatedStepIndex: newMaxStepIndex,
        });
      }

      setActiveStepIndex(stepIndex);
      setMaxActivatedStepIndex(newMaxStepIndex);
    }
  };

  const nextStep = () => {
    goToStep(activeStepIndex + 1);
  };

  const previousStep = () => {
    goToStep(Math.max(activeStepIndex - 1, 0));
  };

  const moveToStep = (stepIndex: number, options?: StepNavigationOptions) => {
    goToStep(stepIndex, { ...options });
  };

  const resetToStep = (stepIndex: number, options?: StepNavigationOptions) => {
    goToStep(stepIndex, { resetMaxStepIndex: true, ...options });
  };

  return {
    activeStepIndex,
    maxActivatedStepIndex,
    goToStep,
    nextStep,
    previousStep,
    getStep,
    moveToStep,
    resetToStep,
  };
};

export interface WizardProps {
  children: ((useWizard: UseWizard) => React.ReactNode) | React.ReactNode;
  initialStepIndex?: number;
  onChange?: OnChangeHandler;
}

export const Wizard: FunctionComponent<WizardProps> = (props: WizardProps) => {
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
    stepRef.current = wizardContext.getStep({
      routeTitle: props.routeTitle,
    });
  }

  return props.children(stepRef.current!);
};

export default Wizard;
