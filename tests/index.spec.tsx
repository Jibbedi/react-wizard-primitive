import React from "react";
import { Wizard, WizardStep } from "../src";
import { cleanup, fireEvent, render } from "react-testing-library";

afterEach(cleanup);

const TestComponent = () => {
  return (
    <Wizard>
      {({ activeStepIndex, maxVisitedStepIndex, nextStep, previousStep }) => (
        <div>
          <div data-testid="activeIndex">{activeStepIndex}</div>
          <div data-testid="maxIndex">{maxVisitedStepIndex}</div>

          <WizardStep>
            {({ isActive, nextStep, resetToStep, moveToStep }) =>
              isActive ? (
                <div data-testid="step-1" onClick={nextStep}>
                  Step 1
                </div>
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

const checkForwardsHandling = (container: any) => {
  // initially only first step should be visible
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();

  // after click on first step, second step should be visible

  fireEvent.click(container.queryByTestId("step-1")!);

  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();
};

test("it should handle forwards correctly", () => {
  const container = render(<TestComponent/>);
  checkForwardsHandling(container);
});

test("it should handle backwards correctly", async () => {
  const container = render(<TestComponent/>);

  // move to step 2

  fireEvent.click(container.queryByTestId("step-1")!);
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();

  // move to previous
  fireEvent.click(container.queryByTestId("step-2")!);
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");
});

test("it should work with global next and prev button", () => {
  const container = render(<TestComponent/>);

  // verify first step is visible
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();

  // use global prev step method
  fireEvent.click(container.queryByTestId("prev-button")!);
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();
});

test("it should move to first step, but leave maxIndex as is", () => {
  const container = render(<TestComponent/>);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();

  // move to first step
  fireEvent.click(container.queryByTestId("step-move")!);
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");
});

test("it should reset to first step and reset maxIndex", () => {
  const container = render(<TestComponent/>);

  // use global next step method
  fireEvent.click(container.queryByTestId("next-button")!);
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();

  // move to first step
  fireEvent.click(container.queryByTestId("step-reset")!);
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("0");
});

test("it should reset to first step and reset maxIndex", () => {
  const container = render(<TestComponentWithChildren/>);
  checkForwardsHandling(container);
});

test("Standalone WizardStep should throw exception", () => {
  expect(() => {
    render(<WizardStep>{() => null}</WizardStep>);
  }).toThrow();
});
