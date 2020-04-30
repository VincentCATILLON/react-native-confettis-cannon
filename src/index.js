// @flow

import * as React from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import type { CompositeAnimation } from 'react-native/Libraries/Animated/src/AnimatedImplementation';
import type { EndResult } from 'react-native/Libraries/Animated/src/animations/Animation';

import Confetti from './components/confetti';
import { randomValue } from './utils';

type Props = {|
  count: number,
  origin: {
    x: number,
    y: number
  },
  explosionSpeed?: number,
  fallSpeed?: number,
  colors?: Array<string>,
  fadeOut?: boolean,
  autoStart?: boolean,
  onAnimationStart?: Array<Item> => void,
  onAnimationResume?: Array<Item> => void,
  onAnimationStop?: Array<Item> => void,
  onAnimationEnd?: Array<Item> => void
|};

type Item = {|
  leftDelta: number,
  topDelta: number,
  swingDelta: number,
  speedDelta: {
    rotateX: number,
    rotateY: number,
    rotateZ: number
  }
|};

export const TOP_MIN = 0.7;
export const DEFAULT_COLORS: Array<string> =[
  '#e67e22',
  '#2ecc71',
  '#3498db',
  '#84AAC2',
  '#E6D68D',
  '#F67933',
  '#42A858',
  '#4F50A2',
  '#A86BB7',
  '#e74c3c',
  '#1abc9c'
];
export const DEFAULT_EXPLOSION_SPEED = 350;
export const DEFAULT_FALL_SPEED = 3000;

class Explosion extends React.PureComponent<Props> {
  props: Props;
  start: () => void;
  resume: () => void;
  stop: () => void;
  items: Array<Item> = [];
  animation: Animated.Value = new Animated.Value(0);
  sequence: CompositeAnimation | null;

  constructor(props: Props) {
    super(props);

    const { count } = this.props;

    this.start = this.start.bind(this);
    this.resume = this.resume.bind(this);
    this.stop = this.stop.bind(this);

    this.items = Array(count).fill().map((): Item => ({
      leftDelta: randomValue(0, 1),
      topDelta: randomValue(TOP_MIN, 1),
      swingDelta: randomValue(0.2, 1),
      speedDelta: {
        rotateX: randomValue(0.3, 1),
        rotateY: randomValue(0.3, 1),
        rotateZ: randomValue(0.3, 1)
      }
    }));
  }

  componentDidMount = () => {
    const { autoStart = true } = this.props;

    if (autoStart) {
      this.start();
    }
  };

  start = (resume?: boolean = false) => {
    const {
      explosionSpeed = DEFAULT_EXPLOSION_SPEED,
      fallSpeed = DEFAULT_FALL_SPEED,
      onAnimationStart,
      onAnimationResume,
      onAnimationEnd
    } = this.props;

    if (resume) {
      onAnimationResume && onAnimationResume(this.items);
    } else {
      this.sequence = Animated.sequence([
        Animated.timing(this.animation, {toValue: 0, duration: 0, useNativeDriver: true}),
        Animated.timing(this.animation, {
          toValue: 1,
          duration: explosionSpeed,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(this.animation, {
          toValue: 2,
          duration: fallSpeed,
          easing: Easing.quad,
          useNativeDriver: true
        }),
      ]);

      onAnimationStart && onAnimationStart(this.items);
    }

    this.sequence && this.sequence.start(({finished}: EndResult) => {
      if (finished) {
        onAnimationEnd && onAnimationEnd(this.items);
      }
    });
  };

  resume = () => this.start(true);

  stop = () => {
    const { onAnimationStop } = this.props;

    onAnimationStop && onAnimationStop(this.items);

    this.sequence && this.sequence.stop();
  };

  render() {
    const { origin, colors = DEFAULT_COLORS, fadeOut } = this.props;
    const { height, width } = Dimensions.get('window');

    return (
      <React.Fragment>
        {this && this.items && this.items.map((item: Item, index: number) => {
          const left = this.animation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [origin.x, item.leftDelta * width, item.leftDelta * width]
          });
          const top = this.animation.interpolate({
            inputRange: [0, 1, 1 + item.topDelta, 2],
            outputRange: [-origin.y, -item.topDelta * height, 0, 0]
          });
          const rotateX = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateX * 360 * 10}deg`]
          });
          const rotateY = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateY * 360 * 5}deg`]
          });
          const rotateZ = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', `${item.speedDelta.rotateZ * 360 * 2}deg`]
          });
          const translateX = this.animation.interpolate({
            inputRange: [0, 0.4, 1.2, 2],
            outputRange: [0, -(item.swingDelta * 30), (item.swingDelta * 30), 0]
          });
          const opacity = this.animation.interpolate({
            inputRange: [0, 1, 1.8, 2],
            outputRange: [1, 1, 1, fadeOut ? 0 : 1]
          });
          const containerTransform = [{translateX: left}, {translateY: top}];
          const transform = [{rotateX}, {rotateY}, {rotate: rotateZ}, {translateX}];

          return (
            <Confetti
              color={colors[Math.round(randomValue(0, colors.length - 1))]}
              containerTransform={containerTransform}
              transform={transform}
              opacity={opacity}
              key={index}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

export default Explosion;
