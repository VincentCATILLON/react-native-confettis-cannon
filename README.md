<p align="center">
  <img height="400" src="https://github.com/VincentCATILLON/react-native-confetti-cannon/raw/master/.github/demo.gif" alt="React-native-confetti-cannon">
</p>

[![CircleCI](https://circleci.com/gh/VincentCATILLON/react-native-confetti-cannon.svg?style=svg)](https://circleci.com/gh/VincentCATILLON/react-native-confetti-cannon)
[![NPM](https://img.shields.io/npm/v/react-native-confetti-cannon/latest?color=%23292C33&label=%20&logo=npm)](https://www.npmjs.com/package/react-native-confetti-cannon)
[![PLATFORMS](https://img.shields.io/badge/Platforms-iOS%20%7C%C2%A0Android%20%7C%20Web-blue)](https://vincentcatillon.github.io/react-native-confetti-cannon)
[![TYPES](https://img.shields.io/npm/types/react-native-confetti-cannon)](https://vincentcatillon.github.io/react-native-confetti-cannon)
[![GITHUB](https://img.shields.io/github/stars/vincentcatillon/react-native-confetti-cannon?style=social)](https://github.com/vincentcatillon/react-native-confetti-cannon)

## Live demo

:rocket: Try yourself on Storybook <a href="https://vincentcatillon.github.io/react-native-confetti-cannon">web version</a>

## Installation

```console
npm install react-native-confetti-cannon
# or
yarn add react-native-confetti-cannon
```

## Usage

```js
import ConfettiCannon from 'react-native-confetti-cannon';

const MyComponent = () => (
  <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
);
```

## Props

| Name             | Type                   | Description                                | Required | Default        |
|------------------|------------------------|--------------------------------------------|----------|----------------|
| count            | number                 | items count to display                     | required |                |
| origin           | {x: number, y: number} | animation position origin                  | required |                |
| explosionSpeed   | number                 | explosion duration (ms) from origin to top |          | 350            |
| size             | number                 | maximum size range of the confettis        |          | 26             |
| fallSpeed        | number                 | fall duration (ms) from top to bottom      |          | 3000           |
| fadeOut          | boolean                | make the confettis disappear at the end    |          | false          |
| colors           | string[]               | give your own colors to the confettis      |          | default colors |
| autoStart        | boolean                | auto start the animation                   |          | true           |
| autoStartDelay   | number                 | delay to wait before triggering animation  |          | 0              |

## Events

| Name              | Returns               | Description                                | Required |
|-------------------|-----------------------|--------------------------------------------|----------|
| onAnimationStart  | void                  | callback triggered at animation start      |          |
| onAnimationResume | void                  | callback triggered at animation resume     |          |
| onAnimationStop   | void                  | callback triggered at animation stop       |          |
| onAnimationEnd    | void                  | callback triggered at animation end        |          |

## Methods

| Name             | Returns                | Description                                | Required |
|------------------|------------------------|--------------------------------------------|----------|
| start            | void                   | start the animation programmatically       |          |
| resume           | void                   | resume the animation programmatically      |          |
| stop             | void                   | stop the animation programmatically        |          |

_For example:_

```js
import ConfettiCannon from 'react-native-confetti-cannon';

class MyComponent extends React.PureComponent {
  explosion;

  handleSomeKindOfEvent = () => {
    this.explosion && this.explosion.start();
  };

  render() {
    return (
      <ConfettiCannon
        count={200}
        origin={{x: -10, y: 0}}
        autoStart={false}
        ref={ref => (this.explosion = ref)}
      />
    );
  }
}
```

## Examples

Deep into the `example` folder to see the [stories](https://github.com/VincentCATILLON/react-native-confetti-cannon/blob/master/example/storybook/stories/index.js) and run:

```console
npm install && npm start
```

And choose one of the following Expo commands:
- `i`: open in iOS simulator
- `a`: open in Android emulator
- `w`: open in web browser

## :warning: Warning

It is strongly recommended to use 1.2.0 or higher to avoid this warning introduced in [React-Native 0.62](https://github.com/react-native-community/releases/blob/master/CHANGELOG.md#deprecated):

> Animated: useNativeDriver was not specified. This is a required option and must be explicitly set to true or false
