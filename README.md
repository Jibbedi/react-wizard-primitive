<div style="text-align:center;">
<img width="100%" src="https://res.cloudinary.com/dgeve7dao/image/upload/v1594285568/react_wizard_logo.png">
</div>

<h4 align="center">
Zero dependencies scaffold for a wizard / stepper without any UI restrictions. Hooks and render props API available!
</h4>

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

[![github stars](https://img.shields.io/github/stars/jibbedi/react-wizard-primitive?label=Star&style=social)](https://github.com/Jibbedi/react-wizard-primitive)

<hr>

<!-- omit in toc -->

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Quick Start](#quick-start)
- [Splitting the wizard in multiple components](#splitting-the-wizard-in-multiple-components)
- [Building your own abstractions](#building-your-own-abstractions)
- [API](#api)
  - [`Step`](#step)
  - [`useWizard`](#usewizard)
    - [Example](#example)
  - [`useWizardStep`](#usewizardstep)
    - [Example](#example-1)
  - [`Wizard`](#wizard)
    - [Example](#example-2)
  - [`WizardStep`](#wizardstep)
    - [Example](#example-3)
- [Routing](#routing)
  - [Basics](#basics)
  - [Initial Hash Route](#initial-hash-route)
  - [Example](#example-4)
- [Examples](#examples)
  - [🔗 Basic Hooks](#-basic-hooks)
  - [🔗 Basic Render Props](#-basic-render-props)
  - [🔗 Buildup Wizard](#-buildup-wizard)
  - [🔗 Custom Abstraction](#-custom-abstraction)
- [Migration from older versions](#migration-from-older-versions)
  - [Upgrading from v1](#upgrading-from-v1)
- [Contributors](#contributors)

## The Problem

You need to implement a wizard / stepper, but have specific UI requirements.
You want a flexible solution that suits a wide range of use cases. Check out [the examples](#examples) to see what's possible.

## The Solution

React Wizard Primitive handles the state management and you bring the UI.
Leverage a render props or hooks API to get rid of the tedious boilerplate.
You can use this library to build other abstractions, that better suit your specific needs on top of it.

## Quick Start

1. Install `react-wizard-primitive`

```bash
npm i react-wizard-primitive
```

2. Create your first wizard

<details open>
  <summary>Hooks API</summary>

```jsx
import React from "react";
import { useWizard } from "react-wizard-primitive";

export default function App() {
  const { getStep, nextStep } = useWizard();
  const stepTitles = ["First", "Second", "Third"]; //let's render them one after the other

  return (
    <div>
      {stepTitles.map(
        (stepTitle) =>
          getStep().isActive && <div onClick={nextStep}>{stepTitle}</div>
      )}
    </div>
  );
}
```

See a working example [here](https://codesandbox.io/s/condescending-minsky-7xy50?file=/src/App.tsx:0-415).

</details>

<details>
  <summary>Render Props API</summary>

```jsx
import React from "react";
import { Wizard } from "react-wizard-primitive";

export default function App() {
  const stepTitles = ["First", "Second", "Third"]; //let's render them one ofter the other

  return (
    <Wizard>
      {({ getStep, nextStep }) => (
        <div>
          {stepTitles.map(
            (stepTitle) =>
              getStep().isActive && <div onClick={nextStep}>{stepTitle}</div>
          )}
        </div>
      )}
    </Wizard>
  );
}
```

See a working example [here](https://codesandbox.io/s/wandering-smoke-qokqu?file=/src/App.tsx:0-463).

</details>

## Splitting the wizard in multiple components

Using the `getStep` function is great if you are creating a small wizard which can live inside a single component.

If your wizard grows it can come in handy to separate each step inside it's own component.
`react-wizard-primitive` makes this really easy.

1. Put a `Wizard` Component as your wizard root
2. Create Step components. All step components inside one Wizard Component work together.

<details open>
  <summary>Hooks API</summary>

```jsx
import React from "react";
import { Wizard, useWizardStep } from "react-wizard-primitive";

const FirstStep = () => {
  const { isActive, nextStep } = useWizardStep();
  return isActive ? <div onClick={nextStep}>First Step</div> : null;
};

const SecondStep = () => {
  const { isActive, nextStep } = useWizardStep();
  return isActive ? <div onClick={nextStep}>Second Step</div> : null;
};

export default function App() {
  return (
    <Wizard>
      <FirstStep />
      {/* a step doesn't need to be a direct child of the wizard. It can be nested inside of html or react components, too!*/}
      <div>
        <SecondStep />
      </div>
    </Wizard>
  );
}
```

See a working example [here](https://codesandbox.io/s/focused-cohen-u5lhx?file=/src/App.tsx).

</details>

<details>
  <summary>Render Props API</summary>

```jsx
import React from "react";
import { Wizard, WizardStep } from "react-wizard-primitive";

const FirstStep = () => {
  return (
    <WizardStep>
      {({ isActive, nextStep }) =>
        isActive ? <div onClick={nextStep}>First Step</div> : null
      }
    </WizardStep>
  );
};

const SecondStep = () => {
  return (
    <WizardStep>
      {({ isActive, nextStep }) =>
        isActive ? <div onClick={nextStep}>Second Step</div> : null
      }
    </WizardStep>
  );
};

export default function App() {
  return (
    <Wizard>
      <FirstStep />
      {/* a step doesn't need to be a direct child of the wizard. It can be nested inside of html or react components, too!*/}
      <div>
        <SecondStep />
      </div>
      {/* WizardStep can also be used without placing it inside another component*/}
      <WizardStep>
        {({ isActive }) => (isActive ? <div>Third Step</div> : null)}
      </WizardStep>
    </Wizard>
  );
}
```

See a working example [here](https://codesandbox.io/s/cool-leaf-nucyl?file=/src/App.tsx:0-939).

</details>

## Building your own abstractions

Sometimes you need a wizard in multiple places, but keep the styling consistent.
`react-wizard-primitive` provides you with basic building blocks that you can use to build powerful abstractions on top of it.

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

See a working example [here](https://codesandbox.io/s/wwo9x7p1k).

## API

### `Step`

A step is the main data structure for the wizard. It is returned by the `getStep` call and provided by `useWizardStep` and the `WizardStep` component.

- _index_ `number`
  > The index of the current step
- _isActive_ `boolean`
  > Is the state the currently active one?
- _hasBeenActive_ `boolean`
  > Has the step been active before?
- _nextStep_ `function`
  > Move to the step _after_ this step.
- _previousStep_ `function`
  > Move to the step _before_ this step.
- _resetToStep_ `function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})`
  > Move to step with index _stepIndex_. Set _hasBeenActive_ for all following steps as well as the new step to false. You can pass in options to control if the _onChange_ handler should be called for this operation.
- _moveToStep_ `function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})`
  > Set this step to be currently active. All following steps will keep the activated state. You can pass in options to control if the _onChange_ handler should be called for this operation. `moveToStep` is an alias of `goToStep`.
- _goToStep_ ``function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})``
  > Go to the step with the given index. You can pass in options to control if the _onChange_ handler should be called for this operation.

### `useWizard`

A hook that manages the state of the wizard and provides you with functions to interact with it

**Arguments**

- _options_ `object` (optional)

  - _initialStepIndex_ `number` (optional)

    > The provided step index will be displayed initially. All previous steps will be treated as if they've been already activated.

  - _onChange_ `function({newStepIndex : number, previousStepIndex: number, maxActivatedStepIndex : number})` (optional)
    > Is called every time the wizard step changes.

**Returns**

- _wizard_ `object`
  - _getStep_ `function(options?) : Step`
    > Creates a [wizard step](#Step) and provides it's current state. It can take an optional options object, which can take a `routeTitle` [See routing](#routing) for more details.
  - _activeStepIndex_ `number`
    > Currently active step
  - _maxActivatedStepIndex_ `number`
    > Index of the furthest step, that has been activated
  - _nextStep_ `function`
    > Call this to proceed to the next step
  - _previousStep_ `function`
    > Call this to proceed to the previous step
  - _resetToStep_ `function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})`
    > Move to step with index _stepIndex_. Set _hasBeenActive_ for all following steps as well as the new step to false. You can pass in options to control if the _onChange_ handler should be called for this operation.
  - _moveToStep_ `function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})`
    > Move to step with index _stepIndex_. You can pass in options to control if the _onChange_ handler should be called for this operation. `moveToStep` is an alias of `goToStep`.
  - _goToStep_ ``function(stepIndex : number, options? : {skipOnChangeHandler?: boolean})``
    > Go to the step with the given index. You can pass in options to control if the _onChange_ handler should be called for this operation.

#### Example

```jsx
// start at third step and log every change
const { getStep } = useWizard({
  initialStepIndex: 2,
  onChange: ({ newStepIndex, previousStepIndex }) => {
    console.log(`I moved from step ${previousStepIndex} to ${newStepIndex}`);
  },
});
```

### `useWizardStep`

A hook that let's you split your wizard into separate components and creates a [wizard step](#Step). It calls `getStep` under the hood.

**Arguments**

- _options_ `WizardStepOptions` (optional)
  > It can take an optional options object, which can take a `routeTitle` [See routing](#routing) for more details.

**Returns**

- A [Step object](#step)

#### Example

```jsx
// isActive will be true if this wizardStep should be rendered, nextStep will move to the next step
const { isActive, nextStep } = useWizardStep();
```

### `Wizard`

A component that servers as the root for a wizard if you choose to split your wizard into [multiple components](#Splitting-the-wizard-in-multiple-components).

Otherwise it can be used as a replacement for the `useWizard` hook.
It takes the same arguments **(as props)** and returns the same values **to the render prop**.

#### Example

```jsx
// start at third step and log every change
<Wizard initialStepIndex="2" onChange={({newStepIndex, previousStepIndex}) => {
  console.log(`I moved from step ${previousStepIndex} to ${newStepIndex}`);
}}>
{
  ({getStep}) => {
    ...
  }
}
</Wizard>
```

### `WizardStep`

A component that serves as an alternative to the `useWizardStep` hook.
It takes the same arguments **(as props)** and returns the same values **to the render prop**.

#### Example

```jsx
// isActive will be true if this wizardStep should be rendered, nextStep will move to the next step
<WizardStep>
{
  ({isActive, nextStep}) => {
    ...
  }
}
</WizardStep>
```

## Routing

### Basics

Out of the box react-wizard-primitive supports an opt-in routing via hash.

In order to use it, you need to specify a routeTitle in the getStep call or pass it as a prop to the _WizardStep_ or _useWizardStep_ hook.
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

## Migration from older versions

### Upgrading from v1

- `hasBeenActive` is now false on first render. To achieve the previous behavior you can modify your code to `hasBeenActive || isActive`
- `maxVisitedStepIndex` has been renamed to `maxActivatedStepIndex` and will not include the currently active step if it's first rendered. To achieve the previous behavior you can modify your code to `Math.max(maxActivatedStepIndex, activeStepIndex)`

## Contributors

<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://turnpro.in"><img src="https://avatars3.githubusercontent.com/u/19505532?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johannes Kling</b></sub></a><br /><a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Code">💻</a> <a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Documentation">📖</a> <a href="#ideas-Jibbedi" title="Ideas, Planning, & Feedback">🤔</a> <a href="#example-Jibbedi" title="Examples">💡</a> <a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Jibbedi" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.josemiguel.org"><img src="https://avatars0.githubusercontent.com/u/6037190?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jose Miguel Bejarano</b></sub></a><br /><a href="#ideas-xDae" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kaYcee"><img src="https://avatars1.githubusercontent.com/u/1464822?v=4?s=100" width="100px;" alt=""/><br /><sub><b>kaYcee</b></sub></a><br /><a href="#ideas-kaYcee" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kaldebert"><img src="https://avatars2.githubusercontent.com/u/10433270?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Aldebert</b></sub></a><br /><a href="#ideas-kaldebert" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://www.carscx.com"><img src="https://avatars2.githubusercontent.com/u/7082868?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Carlos Santos</b></sub></a><br /><a href="https://github.com/Jibbedi/react-wizard-primitive/issues?q=author%3Acarscx" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/andreibeneatol"><img src="https://avatars2.githubusercontent.com/u/38000968?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrei Benea</b></sub></a><br /><a href="https://github.com/Jibbedi/react-wizard-primitive/issues?q=author%3Aandreibeneatol" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Uzwername"><img src="https://avatars2.githubusercontent.com/u/21230845?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Uzwername</b></sub></a><br /><a href="https://github.com/Jibbedi/react-wizard-primitive/commits?author=Uzwername" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

```

```
