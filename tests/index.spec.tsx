import React from "react";
import { useWizard } from "../src";
import { fireEvent, render } from "react-testing-library";

const TestComponent = () => {
  const wizard = useWizard();
  const step1 = wizard.getStep();
  const step2 = wizard.getStep();
  const step3 = wizard.getStep();

  return (
    <div>
      <div data-testid="activeIndex">{wizard.activeStepIndex}</div>
      <div data-testid="maxIndex">{wizard.maxVisitedStepIndex}</div>

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
      {step3.isActive && <div data-testid="step-3">Step 3</div>}
    </div>
  );
};

test("it should handle forward correctly", () => {
  const container = render(<TestComponent />);

  // initially only first step should be visible
  expect(container.queryByTestId("step-1")).toBeTruthy();
  expect(container.queryByTestId("step-2")).toBeNull();
  expect(container.queryByTestId("step-3")).toBeNull();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("0");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("0");

  // after click on first step, second step should be visible

  fireEvent.click(container.queryByTestId("step-1")!);

  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeTruthy();
  expect(container.queryByTestId("step-3")).toBeNull();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("1");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("1");

  // after click on second step, third step should be visible

  fireEvent.click(container.queryByTestId("step-2")!);

  expect(container.queryByTestId("step-1")).toBeNull();
  expect(container.queryByTestId("step-2")).toBeNull();
  expect(container.queryByTestId("step-3")).toBeTruthy();

  expect(container.queryByTestId("activeIndex")!.textContent).toBe("2");
  expect(container.queryByTestId("maxIndex")!.textContent).toBe("2");
});
