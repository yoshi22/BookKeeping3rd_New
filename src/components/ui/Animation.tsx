/**
 * アニメーションコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * スムーズなアニメーションとトランジション
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ViewStyle,
  Easing,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// アニメーション設定
export const animationConfig = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: Easing.inOut(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    spring: Easing.elastic(1.3),
    bounce: Easing.bounce,
  },
};

/**
 * フェードインアニメーション
 */
interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export function FadeIn({ 
  children, 
  duration = animationConfig.duration.normal, 
  delay = 0,
  style 
}: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration, delay]);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
}

/**
 * スライドインアニメーション
 */
interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export function SlideIn({ 
  children, 
  direction, 
  duration = animationConfig.duration.normal,
  delay = 0,
  style 
}: SlideInProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 初期位置を設定
    const initialOffset = 50;
    switch (direction) {
      case 'left':
        translateX.setValue(-initialOffset);
        break;
      case 'right':
        translateX.setValue(initialOffset);
        break;
      case 'up':
        translateY.setValue(-initialOffset);
        break;
      case 'down':
        translateY.setValue(initialOffset);
        break;
    }

    // アニメーション実行
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        delay,
        easing: animationConfig.easing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: animationConfig.easing.easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, translateY, direction, duration, delay]);

  return (
    <Animated.View style={[style, { transform: [{ translateX }, { translateY }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * スケールアニメーション
 */
interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  fromScale?: number;
  toScale?: number;
  style?: ViewStyle;
}

export function ScaleIn({ 
  children, 
  duration = animationConfig.duration.normal,
  delay = 0,
  fromScale = 0.8,
  toScale = 1,
  style 
}: ScaleInProps) {
  const scale = useRef(new Animated.Value(fromScale)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: toScale,
      duration,
      delay,
      easing: animationConfig.easing.spring,
      useNativeDriver: true,
    }).start();
  }, [scale, duration, delay, fromScale, toScale]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * パルスアニメーション（繰り返し）
 */
interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  minScale?: number;
  maxScale?: number;
  style?: ViewStyle;
}

export function Pulse({ 
  children, 
  duration = 1000,
  minScale = 0.95,
  maxScale = 1.05,
  style 
}: PulseProps) {
  const scale = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: duration / 2,
          easing: animationConfig.easing.easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          easing: animationConfig.easing.easeInOut,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [scale, duration, minScale, maxScale]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * 回転アニメーション
 */
interface RotateProps {
  children: React.ReactNode;
  duration?: number;
  degrees?: number;
  continuous?: boolean;
  style?: ViewStyle;
}

export function Rotate({ 
  children, 
  duration = 1000,
  degrees = 360,
  continuous = false,
  style 
}: RotateProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = continuous
      ? Animated.loop(
          Animated.timing(rotation, {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        )
      : Animated.timing(rotation, {
          toValue: 1,
          duration,
          easing: animationConfig.easing.easeInOut,
          useNativeDriver: true,
        });

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotation, duration, continuous]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${degrees}deg`],
  });

  return (
    <Animated.View style={[style, { transform: [{ rotate: rotateInterpolation }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * 進捗バーアニメーション
 */
interface ProgressBarProps {
  progress: number; // 0-100
  duration?: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

export function AnimatedProgressBar({ 
  progress, 
  duration = animationConfig.duration.slow,
  height = 8,
  backgroundColor = '#E0E0E0',
  progressColor = '#4CAF50',
  style 
}: ProgressBarProps) {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: progress,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: false, // width animation requires useNativeDriver: false
    }).start();
  }, [progress, duration, progressValue]);

  const widthInterpolation = progressValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        {
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
        },
        style
      ]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <Animated.View
        style={{
          height: '100%',
          width: widthInterpolation,
          backgroundColor: progressColor,
          borderRadius: height / 2,
        }}
      />
    </Animated.View>
  );
}

/**
 * カウンターアニメーション
 */
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  style?: ViewStyle;
  textStyle?: any;
}

export function AnimatedCounter({ 
  from, 
  to, 
  duration = animationConfig.duration.slow,
  decimals = 0,
  style,
  textStyle 
}: CounterProps) {
  const animatedValue = useRef(new Animated.Value(from)).current;
  const [displayValue, setDisplayValue] = React.useState(from);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Number(value.toFixed(decimals)));
    });

    Animated.timing(animatedValue, {
      toValue: to,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue, from, to, duration, decimals]);

  return (
    <Animated.View style={style}>
      <Animated.Text style={textStyle}>
        {displayValue}
      </Animated.Text>
    </Animated.View>
  );
}

/**
 * スライド切り替えアニメーション
 */
interface SlideTransitionProps {
  children: React.ReactNode;
  direction: 'horizontal' | 'vertical';
  duration?: number;
  style?: ViewStyle;
}

export function SlideTransition({ 
  children, 
  direction,
  duration = animationConfig.duration.normal,
  style 
}: SlideTransitionProps) {
  const slideValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideValue.setValue(direction === 'horizontal' ? screenWidth : screenHeight);
    
    Animated.timing(slideValue, {
      toValue: 0,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: true,
    }).start();
  }, [slideValue, direction, duration]);

  const transformStyle = direction === 'horizontal' 
    ? { transform: [{ translateX: slideValue }] }
    : { transform: [{ translateY: slideValue }] };

  return (
    <Animated.View style={[style, transformStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * フリップカードアニメーション
 */
interface FlipCardProps {
  children: React.ReactNode;
  isFlipped: boolean;
  duration?: number;
  style?: ViewStyle;
}

export function FlipCard({ 
  children, 
  isFlipped, 
  duration = animationConfig.duration.normal,
  style 
}: FlipCardProps) {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration,
      easing: animationConfig.easing.easeInOut,
      useNativeDriver: true,
    }).start();
  }, [flipAnimation, isFlipped, duration]);

  const rotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[style, { transform: [{ rotateY }] }]}>
      {children}
    </Animated.View>
  );
}

/**
 * 特定用途向けのアニメーションコンポーネント
 */

// 問題切り替えアニメーション
export function QuestionTransition({ children, ...props }: SlideInProps) {
  return (
    <SlideIn direction="right" duration={animationConfig.duration.fast} {...props}>
      {children}
    </SlideIn>
  );
}

// 解答結果表示アニメーション
interface AnswerRevealProps {
  children: React.ReactNode;
  isCorrect: boolean;
  style?: ViewStyle;
}

export function AnswerReveal({ children, isCorrect, style }: AnswerRevealProps) {
  return (
    <FadeIn duration={animationConfig.duration.normal}>
      <ScaleIn 
        fromScale={0.9} 
        toScale={1} 
        duration={animationConfig.duration.normal}
        style={style}
      >
        {children}
      </ScaleIn>
    </FadeIn>
  );
}

// 統計更新アニメーション
export function StatsUpdate({ children, ...props }: FadeInProps) {
  return (
    <FadeIn duration={animationConfig.duration.slow} {...props}>
      <SlideIn direction="up" duration={animationConfig.duration.slow}>
        {children}
      </SlideIn>
    </FadeIn>
  );
}