<div align="center">
<h1>
🧙 React Wizard Primitive
</h1
<div margin-bottom="20px">
Zero dependencies boilerplate for a wizard / stepper without any UI restrictions. Hooks available!
</div>
<hr>
</div>

![https://travis-ci.org/Jibbedi/react-wizard-primitive](https://img.shields.io/travis/jibbedi/react-wizard-primitive.svg?style=flat)
![https://codecov.io/gh/Jibbedi/react-wizard-primitive](https://img.shields.io/codecov/c/gh/Jibbedi/react-wizard-primitive.svg?style=flat)
![https://github.com/Jibbedi/react-wizard-primitive/blob/master/LICENSE](https://img.shields.io/npm/l/react-wizard-primitive.svg?style=flat)
![https://www.npmjs.com/package/react-wizard-primitive](https://img.shields.io/npm/v/react-wizard-primitive.svg?style=flat)
![https://www.npmjs.com/package/react-wizard-primitive](https://img.shields.io/npm/types/react-wizard-primitive.svg?style=flat)
![](https://img.shields.io/bundlephobia/min/react-wizard-primitive.svg?style=flat)
![https://www.npmjs.com/package/react-wizard-primitive](https://img.shields.io/badge/Dependencies-None-brightgreen.svg?style=flat)
![http://makeapullrequest.com/](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)
![https://www.npmjs.com/package/react-wizard-primitive](https://img.shields.io/npm/dm/react-wizard-primitive.svg?style=flat)


## Table of Contents
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Hooks API](#hooks-api)
- [Render Props API](#render-props-api)
- [Step](#step)

## The Problem
You need to implement a wizard / stepper, but have specific UI requirements.
You want a flexible solution that suits a wide range of use cases.

## The Solution
React Wizard Primitive handles the state management and you bring the UI.
Leverage a render props or hooks API to get rid of the tedious boilerplate.
You can use this library to build other abstractions, that better suit your specific needs on top of it.

## Basics
The library comes with a render props and hooks API. It's written in TypeScript so you get first level
type support.

## Getting started
Install the library with 
```bash
npm install --save react-wizard-primitive
```

import **useWizard** for the hooks API.
```jsx
import { useWizard } from 'react-wizard-primitive'
```

or
**Wizard** and **WizardStep** for the render props API.
```jsx
import { Wizard, WizardStep } from 'react-wizard-primitive'
```

## Hooks API
The useWizard API returns the state and a set of helper functions.

### activeStepIndex
> number

Currently active step

### nextStep
> function

Call this to proceed to the next step


### previousStep
> function

Call this to proceed to the previous step

### goToStep
> function(stepIndex : number)

Move to step with index *stepIndex*

### getStep
> function : Step

Returns state for the current Step. This needs to be called per wizard step you want to render.
First call will return informations about the first step, second call about the second, etc.

### Example
```jsx
const wizard = useWizard()
const step1 = wizard.getStep()
const step2 = wizard.getStep()
const step3 = wizard.getStep()

return (
  <div>
    {step1.isActive && <div onClick={step1.nextStep}>Step 1</div>}
    {step2.isActive && <div onClick={step2.nextStep}>Step 2</div>}
    {step3.isActive && <div onClick={step3.nextStep}>Step 3</div>}
  </div>
)
```


## Render Props API
### Wizard
> Component

The Wizard component uses **useWizard** internally and exposes a compound components API via Context.
Use this as a top level component for the wizard and put any number of *WizardSteps* in them.

### WizardStep
> Component

The WizardStep component exposed a render props API and passes a *Step* to it.
The step index is determined by the order in the source code.

## Example
```jsx
<Wizard>
  <WizardStep>
     {
      ({isActive, nextStep}) => isActive && <div onClick={nextStep}>Step 1</div>
     }
  </WizardStep>
  
  <WizardStep>
     {
      ({isActive, nextStep}) => isActive && <div onClick={nextStep}>Step 2</div>
     }
  </WizardStep>
  
  <WizardStep>
     {
      ({isActive, nextStep}) => isActive && <div onClick={nextStep}>Step 3</div>
     }
  </WizardStep>
</Wizard>
```

## Step
A step is the main data structure for the wizard.
It contains the following informations:

### index
> number

The index of the current step

### isActive
> boolean

Is the state the currently active one?

### hasBeenActive
> boolean

Has the step been active before, but is **not** currently active?

### nextStep
> function

Move to the step *after* this step.

### previousStep
> function 

Move to the step *before* this step.

### resetToStep
> function

Set this step to be currently active. Mark all following steps to not have been activated before.

### moveToStep
> function

Set this step to be currently active. All following steps will keep the activated step.



