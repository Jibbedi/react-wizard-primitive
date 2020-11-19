import React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import Wizard, { useWizardStep } from "../src";

afterEach(cleanup);
afterEach(jest.clearAllMocks);

const Step: React.FC<{goToStepIndex?: number}> = ({ children, goToStepIndex }) => {
  const { isActive, nextStep, goToStep } = useWizardStep();
  return isActive ? <div onClick={e => goToStepIndex ? goToStep(goToStepIndex) : nextStep()}>{children}</div> : null;
};

const Component = () => {
  return (
    <Wizard>
      <Step>Step One</Step>
      <Step>Step Two</Step>
      <Step>Step Three</Step>
    </Wizard>
  );
};

const ComponentSkipSecond = () => {
    return (
        <Wizard>
            <Step goToStepIndex={2}>Step One</Step>
            <Step>Step Two</Step>
            <Step>Step Three</Step>
        </Wizard>
    );
};

test("it should work with useWizardStep", () => {
  const { getByText } = render(<Component />);
  fireEvent.click(getByText("Step One"));
  expect(getByText("Step Two")).toBeTruthy();
});

test("it should be able to skip steps", () => {
    const { getByText } = render(<ComponentSkipSecond />);
    fireEvent.click(getByText("Step One"));
    expect(getByText("Step Three")).toBeTruthy();
});

