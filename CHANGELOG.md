## 2.0.0 (June 15, 2019)

- breaking change: `hasBeenActive` is now false on first render. To achieve the previous behaviour you can modify your code to `hasBeenActive || isActive`
- breaking change: `maxVisitedStepIndex` has been renamed to `maxActivatedStepIndex` and will not include the currently active step if it's first rendered. To achieve the previous behaviour you can modify your code to `Math.max(maxActivatedStepIndex, activeStepIndex)`

## 1.2.0 (February 10, 2019)
- feature: Added routing support. See README#Routing for details.

## 1.1.2 (February 9, 2019)
- bugfix: wizard step in a nested component now recieves correct wizard step on rerenders
- fixed spelling / grammar in README

## 1.1.1 (February 8, 2019)
- added live examples in README
- fixed spelling / grammar in README

## 1.1.0 (February 6, 2019)
- added support for _moveToStep_ and _resetToStep_ functions in useWizard and Wizard component, which were previously only available at step level.