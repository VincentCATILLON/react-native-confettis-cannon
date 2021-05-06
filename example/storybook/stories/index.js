import * as React from 'react';
import { Dimensions } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { withKnobs, boolean, number, array, button } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import ConfettiCannon, {DEFAULT_COLORS, DEFAULT_EXPLOSION_SPEED, DEFAULT_SIZE, DEFAULT_FALL_SPEED} from 'react-native-confetti-cannon';

import ScreenSimulator from './components/screen-simulator';

const { width } = Dimensions.get('window');

storiesOf('Demo', module)
  .addDecorator(withKnobs)
  .addDecorator(ScreenSimulator)
  .add('Default', () => {
    let ref;

    const result = (
      <ConfettiCannon
        count={number('count', 200, {}, 'Props')}
        origin={{
          x: number('origin.x', -10, {}, 'Props'),
          y: number('origin.y', -10, {}, 'Props')
        }}
        explosionSpeed={number('explosionSpeed', DEFAULT_EXPLOSION_SPEED, {}, 'Props')}
        size={number('size', DEFAULT_SIZE, {}, 'Props')}
        fallSpeed={number('fallSpeed', DEFAULT_FALL_SPEED, {}, 'Props')}
        fadeOut={boolean('fadeOut', false, 'Props')}
        colors={array('colors', DEFAULT_COLORS, ',', 'Props')}
        autoStart={boolean('autoStart', true, 'Props')}
        autoStartDelay={number('autoStartDelay', 1000, {}, 'Props')}
        onAnimationStart={action('onAnimationStart')}
        onAnimationStop={action('onAnimationStop')}
        onAnimationResume={action('onAnimationResume')}
        onAnimationEnd={action('onAnimationEnd')}
        ref={_ref => ref = _ref}
      />
    );

    button('Start', () => ref.start(), 'Methods');
    button('Stop', () => ref.stop(), 'Methods');
    button('Resume', () => ref.resume(), 'Methods');

    return result;
  })
  .add('Multiple', () => {
    let ref1;
    let ref2;

    const result = (
      <React.Fragment>
        <ConfettiCannon
          count={number('count', 100, {}, 'Props (left)')}
          origin={{
            x: number('origin.x', -10, {}, 'Props (left)'),
            y: number('origin.y', -10, {}, 'Props (left)')
          }}
          explosionSpeed={number('explosionSpeed', DEFAULT_EXPLOSION_SPEED, {}, 'Props (left)')}
          size={number('size', DEFAULT_SIZE, {}, 'Props')}
          fallSpeed={number('fallSpeed', DEFAULT_FALL_SPEED, {}, 'Props (left)')}
          fadeOut={boolean('fadeOut', false, 'Props (left)')}
          colors={array('colors', DEFAULT_COLORS, ',', 'Props (left)')}
          autoStart={boolean('autoStart', true, 'Props (left)')}
          autoStartDelay={number('autoStartDelay', 0, {}, 'Props (left)')}
          onAnimationStart={() => {
            action('onAnimationStart (left)');
            setTimeout(ref2.start, DEFAULT_EXPLOSION_SPEED);
          }}
          onAnimationStop={action('onAnimationStop (left)')}
          onAnimationResume={action('onAnimationResume (left)')}
          onAnimationEnd={action('onAnimationEnd (left)')}
          ref={ref => ref1 = ref}
        />
        <ConfettiCannon
          count={number('count', 100, {}, 'Props (right)')}
          origin={{
            x: number('origin.x', width + 10, {}, 'Props (right)'),
            y: number('origin.y', -10, {}, 'Props (right)')
          }}
          explosionSpeed={number('explosionSpeed', DEFAULT_EXPLOSION_SPEED, {}, 'Props (right)')}
          size={number('size', DEFAULT_SIZE, {}, 'Props')}
          fallSpeed={number('fallSpeed', DEFAULT_FALL_SPEED, {}, 'Props (right)')}
          fadeOut={boolean('fadeOut', false, 'Props (right)')}
          colors={array('colors', DEFAULT_COLORS, ',', 'Props (right)')}
          autoStart={boolean('autoStart', false, 'Props (right)')}
          autoStartDelay={number('autoStartDelay', 0, {}, 'Props (right)')}
          onAnimationStart={action('onAnimationStart (right)')}
          onAnimationStop={action('onAnimationStop (right)')}
          onAnimationResume={action('onAnimationResume (right)')}
          onAnimationEnd={action('onAnimationEnd (right)')}
          ref={ref => ref2 = ref}
        />
      </React.Fragment>
    );

    button('Start', () => ref1.start(), 'Methods (left)');
    button('Stop', () => ref1.stop(), 'Methods (left)');
    button('Resume', () => ref1.resume(), 'Methods (left)');

    button('Start', () => ref2.start(), 'Methods (right)');
    button('Stop', () => ref2.stop(), 'Methods (right)');
    button('Resume', () => ref2.resume(), 'Methods (right)');

    return result;
  });
