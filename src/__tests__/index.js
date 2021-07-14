// @flow

import * as React from 'react';
import { Animated, Platform } from 'react-native';
import renderer from 'react-test-renderer';

import ConfettiCannon, {DEFAULT_EXPLOSION_SPEED, DEFAULT_FALL_SPEED} from '..';

describe('index', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Platform.OS = 'ios';
  });

  it('should trigger animations callbacks', () => {
    const handleAnimationStart = jest.fn();
    const handleAnimationResume = jest.fn();
    const handleAnimationStop = jest.fn();
    const handleAnimationEnd = jest.fn();

    renderer.create(
      <ConfettiCannon
        count={10}
        origin={{x: -10, y: 0}}
        onAnimationStart={handleAnimationStart}
        onAnimationResume={handleAnimationResume}
        onAnimationStop={handleAnimationStop}
        onAnimationEnd={handleAnimationEnd}
      />
    );

    jest.runOnlyPendingTimers();

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
    expect(handleAnimationEnd).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(DEFAULT_EXPLOSION_SPEED + DEFAULT_FALL_SPEED);

    expect(handleAnimationEnd).toHaveBeenCalledTimes(1);
    expect(handleAnimationResume).toHaveBeenCalledTimes(0);
    expect(handleAnimationStop).toHaveBeenCalledTimes(0);
  });

  it('should be able to customize speeds', () => {
    const handleAnimationStart = jest.fn();
    const handleAnimationEnd = jest.fn();
    const explosionSpeed = 35;
    const fallSpeed = 300;

    renderer.create(
      <ConfettiCannon
        count={10}
        origin={{x: -10, y: 0}}
        explosionSpeed={explosionSpeed}
        fallSpeed={fallSpeed}
        fadeOut={true}
        onAnimationStart={handleAnimationStart}
        onAnimationEnd={handleAnimationEnd}
      />
    );

    expect(handleAnimationEnd).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(explosionSpeed + fallSpeed);

    expect(handleAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('should not start if autoStart is disabled', () => {
    const handleAnimationStart = jest.fn();

    renderer.create(
      <ConfettiCannon
        count={10}
        origin={{x: -10, y: 0}}
        autoStart={false}
        onAnimationStart={handleAnimationStart}
      />
    );

    jest.advanceTimersByTime(DEFAULT_EXPLOSION_SPEED + DEFAULT_FALL_SPEED);

    expect(handleAnimationStart).toHaveBeenCalledTimes(0);
  });

  it('should start after delay', () => {
    const autoStartDelay = 100;
    const handleAnimationStart = jest.fn();

    renderer.create(
      <ConfettiCannon
        count={10}
        origin={{x: -10, y: 0}}
        autoStartDelay={autoStartDelay}
        onAnimationStart={handleAnimationStart}
      />
    );

    jest.advanceTimersByTime(autoStartDelay - 1);

    expect(handleAnimationStart).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1);

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
  });

  it('should be able to start animation programmatically', () => {
    const handleAnimationStart = jest.fn();
    const handleAnimationResume = jest.fn();
    const handleAnimationStop = jest.fn();
    const handleAnimationEnd = jest.fn();
    const ref = jest.fn<[ConfettiCannon | null], void>();

    renderer.create(
      <ConfettiCannon
        count={10}
        origin={{x: -10, y: 0}}
        autoStart={false}
        onAnimationStart={handleAnimationStart}
        onAnimationResume={handleAnimationResume}
        onAnimationStop={handleAnimationStop}
        onAnimationEnd={handleAnimationEnd}
        ref={ref}
      />
    );

    const [confettiCannon] = ref.mock.calls[0];

    confettiCannon && confettiCannon.start();

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
    expect(handleAnimationResume).toHaveBeenCalledTimes(0);
    expect(handleAnimationStop).toHaveBeenCalledTimes(0);
    expect(handleAnimationEnd).toHaveBeenCalledTimes(0);

    confettiCannon && confettiCannon.stop();

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
    expect(handleAnimationResume).toHaveBeenCalledTimes(0);
    expect(handleAnimationStop).toHaveBeenCalledTimes(1);
    expect(handleAnimationEnd).toHaveBeenCalledTimes(0);

    confettiCannon && confettiCannon.resume();

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
    expect(handleAnimationResume).toHaveBeenCalledTimes(1);
    expect(handleAnimationStop).toHaveBeenCalledTimes(1);
    expect(handleAnimationEnd).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(DEFAULT_EXPLOSION_SPEED + DEFAULT_FALL_SPEED);

    expect(handleAnimationStart).toHaveBeenCalledTimes(1);
    expect(handleAnimationResume).toHaveBeenCalledTimes(1);
    expect(handleAnimationStop).toHaveBeenCalledTimes(1);
    expect(handleAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('should re-render items without changing colors already set', () => {
    const origin = {x: -10, y: 0};
    const count1 = 10;
    const count2 = 20;
    const count3 = 5;

    const component = renderer.create(
      <ConfettiCannon count={count1} origin={origin} />
    );

    const confettis1 = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));
    const colors1 = confettis1.map(confetti => confetti.props.color);

    expect(confettis1.length).toEqual(count1);

    component.update(
      <ConfettiCannon count={count2} origin={origin} />
    );

    const confettis2 = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));
    const colors2 = confettis2.map(confetti => confetti.props.color);

    expect(confettis2.length).toEqual(count2);
    expect(colors1).toEqual(colors2.slice(0, count1));

    component.update(
      <ConfettiCannon count={count3} origin={origin} />
    );

    const confettis3 = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));
    const colors3 = confettis3.map(confetti => confetti.props.color);

    expect(confettis3.length).toEqual(count3);
    expect(colors1.slice(0, count3)).toEqual(colors3.slice(0, count3));
  });

  it('should re-render items colors if colors prop changes', () => {
    const origin = {x: -10, y: 0};
    const count = 1;
    const color1 = '#000';
    const color2 = '#fff';

    const component = renderer.create(
      <ConfettiCannon count={count} origin={origin} colors={[color1]} />
    );

    const confetti = component.root.find(el => el.props.testID === 'confetti-1');

    expect(confetti.props.color).toEqual(color1);

    component.update(
      <ConfettiCannon count={count} origin={origin} colors={[color2]} />
    );

    expect(confetti.props.color).toEqual(color2);
  });

  it('should not change items if colors or count dont change', () => {
    const origin = {x: -10, y: 0};
    const count = 1000;

    const component = renderer.create(
      <ConfettiCannon count={count} origin={origin} />
    );

    const confettis1 = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));

    component.update(
      <ConfettiCannon count={count} origin={origin} fadeOut={true} />
    );

    const confettis2 = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));

    expect(confettis1).toEqual(confettis2);
  });

  it('should include the perspective transform on the Android platform', () => {
    Platform.OS = 'android';

    const origin = {x: -10, y: 0};
    const count = 1000;

    const component = renderer.create(
      <ConfettiCannon count={count} origin={origin} />
    );
    const confetti = component.root.find(el => el.props.testID === 'confetti-1');

    expect(confetti.props.transform).toEqual(expect.arrayContaining([{ perspective: 100 }]));
  });

  it('should set "renderToHardwareTextureAndroid" prop to true for confetti animated view', () => {
    const origin = {x: -10, y: 0};
    const count = 1000;

    const component = renderer.create(
      <ConfettiCannon count={count} origin={origin} />
    );
    
    const confettiAnimatedView = component.root
        .find(el => el.props.testID === 'confetti-1')
        .findByType(Animated.View);

    expect(confettiAnimatedView.props.renderToHardwareTextureAndroid).toEqual(true);
  });

  it('should not render children if autoStart is disabled', () => {
    const origin = {x: -10, y: 0};
    const count = 10;

    const component = renderer.create(
      <ConfettiCannon count={count} origin={origin} autoStart={false} />
    );
    expect(component.toJSON()).toBeNull();
  });

  it('should render children when started programatically and unmount after animation', ()=>{
    const ref = jest.fn<[ConfettiCannon | null], void>();
    const count = 10
    const component = renderer.create(
      <ConfettiCannon
        count={count}
        origin={{x: -10, y: 0}}
        autoStart={false}
        ref={ref}
      />
    );

    const [confettiCannon] = ref.mock.calls[0];

    confettiCannon && confettiCannon.start();
    const items = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));
    expect(items.length).toEqual(count);
    
    confettiCannon && confettiCannon.stop();
    
    const itemsAfterStrop = component.root.findAll(el => el.props.testID && el.props.testID.match(/confetti/g));
    expect(itemsAfterStrop.length).toEqual(count);

    confettiCannon && confettiCannon.resume();
    
    jest.advanceTimersByTime(DEFAULT_EXPLOSION_SPEED + DEFAULT_FALL_SPEED);
    
    expect(component.toJSON()).toBeNull();
  })

});
