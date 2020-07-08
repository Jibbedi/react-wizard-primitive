import React from "react";
import { Wizard, WizardStep, useWizard } from "../src";
import { cleanup, fireEvent, render } from "react-testing-library";
import * as routing from "../src/routing";

afterEach(cleanup);
afterEach(() => (window.location.hash = ""));
afterEach(() => jest.restoreAllMocks());

const TestComponent = () => {
  return (
    <Wizard>
      <WizardStep routeTitle="FirstStep">
        {({ isActive, nextStep }) =>
          isActive && (
            <div data-testid="step-1" onClick={nextStep}>
              Step 1
            </div>
          )
        }
      </WizardStep>

      <WizardStep routeTitle="SecondStep">
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
};

const BuildUpWizardTestComponent = () => {
  return (
    <Wizard>
      <WizardStep routeTitle="FirstStep">
        {({ hasBeenActive, nextStep }) =>
          hasBeenActive && (
            <div data-testid="step-1" onClick={nextStep}>
              Step 1
            </div>
          )
        }
      </WizardStep>

      <WizardStep routeTitle="SecondStep">
        {({ hasBeenActive, previousStep }) =>
          hasBeenActive && (
            <div data-testid="step-2" onClick={previousStep}>
              Step 2
            </div>
          )
        }
      </WizardStep>
    </Wizard>
  );
};

const TestComponentWithPartialRouteTitles = () => {
  return (
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

      <WizardStep routeTitle="SecondStep">
        {({ isActive, previousStep }) =>
          isActive && (
            <div data-testid="step-2" onClick={previousStep}>
              Step 2
            </div>
          )
        }
      </WizardStep>

      <WizardStep>
        {({ isActive, previousStep }) =>
          isActive && (
            <div data-testid="step-3" onClick={previousStep}>
              Step 3
            </div>
          )
        }
      </WizardStep>
    </Wizard>
  );
};

const TestComponentWithoutAnyRouteTitles = () => {
  return (
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

      <WizardStep>
        {({ isActive, previousStep }) =>
          isActive && (
            <div data-testid="step-3" onClick={previousStep}>
              Step 3
            </div>
          )
        }
      </WizardStep>
    </Wizard>
  );
};

const ConditionallyRenderedSteps = () => {
  const { getStep } = useWizard();
  const [list, setList] = React.useState<string[]>([]);
  return (
    <div>
      {list.map(
        (entry) =>
          getStep({ routeTitle: entry }).isActive && (
            <div key={entry}>{entry}</div>
          )
      )}
    </div>
  );
};

const verifyOnlyFirstStepIsVisible = (container: any) => {
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();
};

const verifyOnlySecondStepIsVisible = (container: any) => {
  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();
};

test("it should update hash location if route title is present", () => {
  const container = render(<TestComponent />);
  container.rerender(<TestComponent />);

  verifyOnlyFirstStepIsVisible(container);
  expect(window.location.hash).toBe("#FirstStep");

  fireEvent.click(container.queryByTestId("step-1")!);
  container.rerender(<TestComponent />);
  verifyOnlySecondStepIsVisible(container);
  expect(window.location.hash).toBe("#SecondStep");
});

test("it should move to second step if location hash matches", () => {
  window.location.hash = "SecondStep";

  const container = render(<TestComponent />);
  container.rerender(<TestComponent />);

  verifyOnlySecondStepIsVisible(container);
  expect(window.location.hash).toBe("#SecondStep");
});

test("it should set hasBeenActive to true for all preceding steps if hash location redirects to a different initial step", () => {
  window.location.hash = "SecondStep";

  const container = render(<BuildUpWizardTestComponent />);
  container.rerender(<BuildUpWizardTestComponent />);

  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeFalsy();
  expect(window.location.hash).toBe("#SecondStep");
});

test("it should render initial step if location hash is unknown", () => {
  window.location.hash = "UnknownHash";

  const container = render(<TestComponent />);
  container.rerender(<TestComponent />);

  verifyOnlyFirstStepIsVisible(container);
  expect(window.location.hash).toBe("#FirstStep");
});

test("it should not update hash location if some route titles are missing and warn about it", () => {
  const consoleSpy = jest.spyOn(console, "warn");

  const container = render(<TestComponentWithPartialRouteTitles />);
  container.rerender(<TestComponentWithPartialRouteTitles />);

  expect(window.location.hash).toBe("");
  expect(consoleSpy).toBeCalledWith(
    "You have not specified a title for the steps with the indices: 0, 2"
  );
});

test("it should not update hash location if all route titles are missing but don't warn about it", () => {
  const consoleSpy = jest.spyOn(console, "warn");

  const container = render(<TestComponentWithoutAnyRouteTitles />);
  container.rerender(<TestComponentWithoutAnyRouteTitles />);

  expect(window.location.hash).toBe("");
  expect(consoleSpy).not.toBeCalled();
});

test("it should not update hash location if window is not defined (ssr)", () => {
  const consoleSpy = jest.spyOn(console, "warn");

  jest.spyOn(routing, "getWindow").mockReturnValue(null);

  const container = render(<TestComponent />);
  container.rerender(<TestComponent />);

  expect(window.location.hash).toBe("");
  expect(consoleSpy).not.toBeCalled();
});

test("it should work with conditionally rendered steps", () => {
  const { rerender } = render(<ConditionallyRenderedSteps />);
  rerender(<ConditionallyRenderedSteps />);
  expect(window.location.hash).toBe("");
});
