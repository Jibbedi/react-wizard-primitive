import React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import Wizard, { useWizardStep } from "../src";

afterEach(cleanup);
afterEach(jest.clearAllMocks);

const Step: React.FC = ({ children }) => {
  const { isActive, nextStep } = useWizardStep();
  return isActive ? <div onClick={nextStep}>{children}</div> : null;
};

const Component = () => {
  return (
    <Wizard>
      <Step>Step One</Step>
      <Step>Step Two</Step>
    </Wizard>
  );
};

test("it should work with useWizardStep", () => {
  const { getByText } = render(<Component />);
  fireEvent.click(getByText("Step One"));
  expect(getByText("Step Two")).toBeTruthy();
});
