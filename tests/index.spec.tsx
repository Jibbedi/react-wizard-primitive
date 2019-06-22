import React, { useState } from "react";
import { useWizard, Wizard, WizardStep } from "../src";
import { cleanup, fireEvent, render } from "react-testing-library";

afterEach(cleanup);

const HooksComponent = () => {
  const wizard = useWizard();
  const step1 = wizard.getStep();
  const step2 = wizard.getStep();

  return (
    <div>
      {step1.isActive && (
        <div data-testid="step-1" onClick={step1.nextStep}>
          Step 1
        </div>
      )}

      {step2.isActive && (
        <div data-testid="step-2" onClick={step2.nextStep}>
          Step 2
        </div>
      )}
    </div>
  );
};

const TestComponent = ({ initialStepIndex = 0 }) => {
  return (
    <Wizard initialStepIndex={initialStepIndex}>
      {({
        activeStepIndex,
        maxActivatedStepIndex,
        nextStep,
        previousStep,
        resetToStep,
        moveToStep
      }) => (
        <div>
          <div data-testid="activeIndex">{activeStepIndex}</div>
          <div data-testid="maxIndex">{maxActivatedStepIndex}</div>

          <WizardStep>
            {({ isActive, hasBeenActive, nextStep, resetToStep, moveToStep }) =>
              isActive ? (
                <>
                  <div data-testid="step-1" onClick={nextStep}>
                    Step 1
                  </div>
                  {!hasBeenActive && (
                    <div data-testid="first-render">first render</div>
                  )}
                </>
              ) : (
                <div>
                  <button data-testid="step-move" onClick={moveToStep}>
                    move to first
                  </button>
                  <button data-testid="step-reset" onClick={resetToStep}>
                    reset to first
                  </button>
                </div>
              )
            }
          </WizardStep>

          <WizardStep>
            {({ isActive, previousStep }) =>
              isActive && (
                <div data-testid="step-2" onClick={previousStep}>
                  Step 2
                </div>
              )
            }
          </WizardStep>

          <button data-testid="next-button" onClick={nextStep}>
            Next Step
          </button>
          <button data-testid="prev-button" onClick={previousStep}>
            Previous Step
          </button>
          <button
            data-testid="global-move"
            onClick={(_: never) => moveToStep(0)}
          >
            Move to first step
          </button>
          <button
            data-testid="global-reset"
            onClick={(_: never) => resetToStep(0)}
          >
            Reset to first step
          </button>
        </div>
      )}
    </Wizard>
  );
};

const TestComponentWithChildren = () => (
  <Wizard>
    <WizardStep>
      {({ isActive, nextStep }) =>
        isActive && (
          <div data-testid="step-1" onClick={nextStep}>
            Step 1
          </div>
        )
      }
    </WizardStep>
    <WizardStep>
      {({ isActive, previousStep }) =>
        isActive && (
          <div data-testid="step-2" onClick={previousStep}>
            Step 2
          </div>
        )
      }
    </WizardStep>
  </Wizard>
);

const NestedWizardStep = () => {
  const [state, updateState] = useState(1);

  return (
    <div>
      {state}
      <button
        data-testid="force-rerender"
        onClick={e => updateState(state + 1)}
      >
        Force Rerender
      </button>
      <WizardStep>
        {({ isActive, nextStep }) =>
          isActive && (
            <div data-testid="step-1" onClick={nextStep}>
              Step 1
            </div>
          )
        }
      </WizardStep>
    </div>
  );
};

const TestComponentWithNestedWizardStep = () => (
  <Wizard>
    <NestedWizardStep />
    <WizardStep>
      {({ isActive, previousStep }) =>
        isActive && (
          <div data-testid="step-2" onClick={previousStep}>
            Step 2
          </div>
        )
      }
    </WizardStep>
  </Wizard>
);

const verifyOnlyFirstStepIsVisible = (container: any) => {
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();
};

const verifyOnlySecondStepIsVisible = (container: any) => {
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();
};

const checkForwardsHandling = (container: any) => {
  // initially only first step should be visible
  verifyOnlyFirstStepIsVisible(container);

  // after click on first step, second step should be visible

  fireEvent.click(container.queryByTestId("step-1")!);

  verifyOnlySecondStepIsVisible(container);
};

test("it should handle forward correctly with hooks", () => {
  const container = render(<HooksComponent />);
  checkForwardsHandling(container);
});

test("it should handle forwards correctly", () => {
  const container = render(<TestComponent />);
  checkForwardsHandling(container);
});

test("it should handle backwards correctly", async () => {
  const container = render(<TestComponent />);

  // move to step 2

  fireEvent.click(container.queryByTestId("step-1")!);
  verifyOnlySecondStepIsVisible(container);

  // move to previous
  fireEvent.click(container.queryByTestId("step-2")!);
  verifyOnlyFirstStepIsVisible(container);

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");
});

test("it should work with global next and prev button", () => {
  const container = render(<TestComponent />);

  // verify first step is visible
  verifyOnlyFirstStepIsVisible(container);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);

  // use global prev step method
  fireEvent.click(container.queryByTestId("prev-button")!);
  verifyOnlyFirstStepIsVisible(container);
});

test("it should move to first step, but leave maxIndex as is", () => {
  const container = render(<TestComponent />);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);

  // move to first step
  fireEvent.click(container.queryByTestId("step-move")!);
  verifyOnlyFirstStepIsVisible(container);

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");
});

test("it should reset to first step and reset maxIndex", () => {
  const container = render(<TestComponent />);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);

  // move to first step
  fireEvent.click(container.queryByTestId("step-reset")!);
  verifyOnlyFirstStepIsVisible(container);

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("-1");
});

test("it should work with global moveToStep", () => {
  const container = render(<TestComponent />);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);

  // move to first step using global moveToStep function
  fireEvent.click(container.queryByTestId("global-move")!);
  verifyOnlyFirstStepIsVisible(container);

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");
});

test("it should hasBeenActive to false on first render", () => {
  const container = render(<TestComponent />);

  verifyOnlyFirstStepIsVisible(container);
  expect(container.getByTestId("first-render")).toBeTruthy();
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);
  fireEvent.click(container.queryByTestId("prev-button")!);
  verifyOnlyFirstStepIsVisible(container);
  expect(container.queryByTestId("first-render")).toBeNull();
});

test("it should work with global resetToStep and reset maxIndex", () => {
  const container = render(<TestComponent />);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  verifyOnlySecondStepIsVisible(container);

  // move to first step using global resetToStep function
  fireEvent.click(container.queryByTestId("global-reset")!);
  verifyOnlyFirstStepIsVisible(container);

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("-1");
});

test("it should work with nested wizard steps", () => {
  const container = render(<TestComponentWithNestedWizardStep />);
  verifyOnlyFirstStepIsVisible(container);

  // event in nested component forces rerender of that component
  fireEvent.click(container.queryByTestId("force-rerender")!);

  // it should still show first step
  verifyOnlyFirstStepIsVisible(container);
});

test("it should work with jsx instead of function as child", () => {
  const container = render(<TestComponentWithChildren />);
  checkForwardsHandling(container);
});

test("it should throw an exception if WizardStep is used standalone", () => {
  expect(() => {
    render(<WizardStep>{() => null}</WizardStep>);
  }).toThrow();
});

test("it should respect initial step index", () => {
  const container = render(<TestComponent initialStepIndex={1} />);

  verifyOnlySecondStepIsVisible(container);
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("0");
});
