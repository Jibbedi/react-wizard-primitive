<h1 align="center">
🧙 React Wizard Primitive 🦕
</h1>

<h4 align="center">
Zero dependencies boilerplate for a wizard / stepper without any UI restrictions. Hooks available!
</h4>

<hr>

[![Build](https://img.shields.io/travis/Jibbedi/react-wizard-primitive.svg?style=flat)](https://travis-ci.org/Jibbedi/react-wizard-primitive)
[![Coverage](https://img.shields.io/codecov/c/gh/Jibbedi/react-wizard-primitive.svg?style=flat)](https://codecov.io/gh/Jibbedi/react-wizard-primitive)
[![License](https://img.shields.io/npm/l/react-wizard-primitive.svg?style=flat)](https://github.com/Jibbedi/react-wizard-primitive/blob/master/LICENSE)
[![Version](https://img.shields.io/npm/v/react-wizard-primitive.svg?style=flat)](https://www.npmjs.com/package/react-wizard-primitive)
[![Types](https://img.shields.io/npm/types/react-wizard-primitive.svg?style=flat)](https://www.npmjs.com/package/react-wizard-primitive)
[![Size](https://img.shields.io/bundlephobia/min/react-wizard-primitive.svg?style=flat)](https://www.npmjs.com/package/react-wizard-primitive)
[![Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen.svg?style=flat)](https://www.npmjs.com/package/react-wizard-primitive)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com/)
[![Downloads](https://img.shields.io/npm/dm/react-wizard-primitive.svg?style=flat)](https://www.npmjs.com/package/react-wizard-primitive)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Table of Contents

- [Upgrading from v1](#upgrading-from-v1)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Hooks API](#hooks-api)
- [Render Props API](#render-props-api)
- [Step](#step)
- [Routing](#routing)
- [Examples](#examples)
- [Contributors](#contributors)

## Upgrading from v1

- `hasBeenActive` is now false on first render. To achieve the previous behavior you can modify your code to `hasBeenActive || isActive`
- `maxVisitedStepIndex` has been renamed to `maxActivatedStepIndex` and will not include the currently active step if it's first rendered. To achieve the previous behavior you can modify your code to `Math.max(maxActivatedStepIndex, activeStepIndex)`

## The Problem

You need to implement a wizard / stepper, but have specific UI requirements.
You want a flexible solution that suits a wide range of use cases. Check out [the examples](#examples) to see what's possible.

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
import { useWizard } from "react-wizard-primitive";
```

or
**Wizard** and **WizardStep** for the render props API.

```jsx
import { Wizard, WizardStep } from "react-wizard-primitive";
```

## Hooks API

### Props

You can optionally pass an `UseWizardProps` into the hooks.

#### initialStepIndex

> number

Sets the `activeStepIndex` to the given index. All previous steps will be treated as if they've been already activated.

#### onChange

> function({newStepIndex : number, previousStepIndex: number, maxActivatedStepIndex : number})

Is called every time the wizard step changes.

### Return Values

The useWizard API returns the state and a set of helper functions.

#### activeStepIndex

> number

Currently active step

#### maxActivatedStepIndex

> number

Index of the furthest step, that has been activated

#### nextStep

> function

Call this to proceed to the next step

#### previousStep

> function

Call this to proceed to the previous step

#### moveToStep

> function(stepIndex : number)

Move to step with index _stepIndex_

#### resetToStep

> function(stepIndex : number)

Move to step with index _stepIndex_. Set _hasBeenActive_ for all following steps as well as the new step to false.

#### getStep

> function(options?) : Step

Returns state for the current Step. This needs to be called for each wizard step you want to render.
First call will return information about the first step, second call about the second, etc.

It accepts an _optional_ options object, which takes a string routeTitle in.
See [Routing](#routing) for further information.

### Example

```jsx
const wizard = useWizard();
const step1 = wizard.getStep();
const step2 = wizard.getStep();
const step3 = wizard.getStep();

return (
  <div>
    {step1.isActive && <div onClick={step1.nextStep}>Step 1</div>}
    {step2.isActive && <div onClick={step2.nextStep}>Step 2</div>}
    {step3.isActive && <div onClick={step3.nextStep}>Step 3</div>}
  </div>
);
```

## Render Props API

### Wizard

> Component

The Wizard component uses **useWizard** internally and exposes a compound components API via Context.
Use this as a top level component for the wizard and put any number of _WizardSteps_ in it.

You can _optionally_ provide a render prop, which gets passed the same values that _useWizard_ returns.

#### Props

#### initialStepIndex

> number

Sets the `activeStepIndex` to the given index. All previous steps will be treated as if they've been already activated.

#### onChange

> function({newStepIndex : number, previousStepIndex: number, maxActivatedStepIndex : number})

Is called every time the wizard step changes.

### WizardStep

> Component

The WizardStep component exposed a render props API and passes a _Step_ to it.
The step index is determined by the order in the source code.

It takes an optional string _routeTitle_ as a prop. See [Routing](#routing) for further information.

### Example

```jsx
<Wizard>
  <WizardStep>
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 1</div>
    }
  </WizardStep>

  <WizardStep>
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 2</div>
    }
  </WizardStep>

  <WizardStep>
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 3</div>
    }
  </WizardStep>
</Wizard>
```

or with render props:

```jsx
<Wizard>
  {({ activeStepIndex }) => (
    <div>
      Active Step is: {activeStepIndex}
      <WizardStep>
        {({ isActive, nextStep }) =>
          isActive && <div onClick={nextStep}>Step 1</div>
        }
      </WizardStep>
      <WizardStep>
        {({ isActive, nextStep }) =>
          isActive && <div onClick={nextStep}>Step 2</div>
        }
      </WizardStep>
      <WizardStep>{({ isActive, nextStep }) => isActive && <div onClick={nextStep}>Step 3</div>}</WizardStep>
    </div>
  )}
</Wizard>
```

## Step

A step is the main data structure for the wizard.
It contains the following information:

### index

> number

The index of the current step

### isActive

> boolean

Is the state the currently active one?

### hasBeenActive

> boolean

Has the step been active before?

### nextStep

> function

Move to the step _after_ this step.

### previousStep

> function

Move to the step _before_ this step.

### resetToStep

> function

Set this step to be currently active. Set hasBeenActive for all following steps to false.

### moveToStep

> function

Set this step to be currently active. All following steps will keep the activated state.

## Routing

### Basics

Out of the box react-wizard-primitive supports an opt-in routing via hash.

In order to use it, you need to specify a routeTitle in the getStep call or pass it as a prop to the _WizardStep_.
The routeTitle will be used as the hash.

If no routeTitle is provided, react-wizard-primitive won't make any changes to the URL.
If only some steps are provided with a title, we assume that this happened by mistake, and won't change the url either.
Instead we log a warning to the console, indicating which steps are missing a title.

### Initial Hash Route

If a hash is present when the wizard is first rendered, it will try to find a matching step to that hash and jump to it
or otherwise jump to the initial step.

You can use this behaviour to start the wizard at any given point.

### Example

```jsx
<Wizard>
  {"yourdomain.com/#/first-step"}
  <WizardStep routeTitle="first-step">
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 1</div>
    }
  </WizardStep>

  {"yourdomain.com/#/second-step"}
  <WizardStep routeTitle="second-step">
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 2</div>
    }
  </WizardStep>

  {"yourdomain.com/#/third-step"}
  <WizardStep routeTitle="third-step">
    {({ isActive, nextStep }) =>
      isActive && <div onClick={nextStep}>Step 3</div>
    }
  </WizardStep>
</Wizard>
```

## Examples

You can build nearly anything on top of react-wizard-primitive.
Take a look at those examples to get an idea of what's possible.

### [🔗 Basic Hooks](https://codesandbox.io/s/93z0j38q0y)

> This is a good starting point, if you want to see a basic hook implementation.
> A classical wizard, which displays the steps one after the other.

![Basic Example](https://media.giphy.com/media/2UoCNCX8SH2hxY2hQA/giphy.gif)

### [🔗 Basic Render Props](https://codesandbox.io/s/ppq9zx3zj7)

> Same example, but implemented with the render props API.

### [🔗 Buildup Wizard](https://codesandbox.io/s/6j65768yqr)

> This example demonstrates, how you can build a wizard that displays the steps one after another, but keeps the already displayed steps around.

![Buildup Wizard](https://media.giphy.com/media/fxzFlmPaffmgImTpM7/giphy.gif)

### [🔗 Custom Abstraction](https://codesandbox.io/s/wwo9x7p1k)

> It can get tedious to work with the basic building blocks and repeat styling or display handling all over again. This example demonstrates how you can build your own abstractions on top of react-wizard-primitive.

```jsx
<MyCustomWizard>
  <MyCustomWizard.Step>
    <TextFields />
  </MyCustomWizard.Step>
  <MyCustomWizard.Step>
    <div>Just some other inline jsx</div>
  </MyCustomWizard.Step>
  <MyCustomWizard.Step>
    <div>And another one</div>
  </MyCustomWizard.Step>
  <MyCustomWizard.Step>
    <div>Last one</div>
  </MyCustomWizard.Step>
</MyCustomWizard>
```

![Buildup Wizard](https://media.giphy.com/media/8PBsWFyO1haMFsbQLp/giphy.gif)

## Contributors

<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://turnpro.in"><img src="https://avatars3.githubusercontent.com/u/19505532?v=4" width="100px;" alt="Johannes Kling"/><br /><sub><b>Johannes Kling</b></sub></a><br /><a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Code">💻</a> <a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Documentation">📖</a> <a href="#ideas-Jibbedi" title="Ideas, Planning, & Feedback">🤔</a> <a href="#example-Jibbedi" title="Examples">💡</a> <a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.josemiguel.org"><img src="https://avatars0.githubusercontent.com/u/6037190?v=4" width="100px;" alt="Jose Miguel Bejarano"/><br /><sub><b>Jose Miguel Bejarano</b></sub></a><br /><a href="#ideas-xDae" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kaYcee"><img src="https://avatars1.githubusercontent.com/u/1464822?v=4" width="100px;" alt="kaYcee"/><br /><sub><b>kaYcee</b></sub></a><br /><a href="#ideas-kaYcee" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
