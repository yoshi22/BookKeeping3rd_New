/**
 * アニメーションシステム - 簿記3級問題集アプリ
 * UI/UX改善 Phase 1: マイクロインタラクション・トランジション
 *
 * React Native Animatedを活用したスムーズな体験
 * 学習アプリに適した段階的・心地よいアニメーション
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { Animated, Easing, Platform } from 'react-native';

/**
 * アニメーションの種類定義
 */
export type AnimationType = 'fade' | 'scale' | 'slide' | 'bounce' | 'spring' | 'rotate';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'in' | 'out';
export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'very-slow';

/**
 * アニメーション設定
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
  loop?: boolean;
  iterations?: number;
}

/**
 * プリセット設定
 */
export const AnimationPresets = {
  // 基本的なフェード
  fadeIn: {
    duration: 300,
    easing: Easing.ease,
    useNativeDriver: true,
  },
  fadeOut: {
    duration: 200,
    easing: Easing.ease,
    useNativeDriver: true,
  },

  // スケールアニメーション
  scaleIn: {
    duration: 300,
    easing: Easing.back(1.7),
    useNativeDriver: true,
  },
  scaleOut: {
    duration: 200,
    easing: Easing.ease,
    useNativeDriver: true,
  },

  // スライドアニメーション  
  slideInFromRight: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },
  slideInFromLeft: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },
  slideUp: {
    duration: 250,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  },
  slideDown: {
    duration: 250,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  },

  // スプリングアニメーション
  spring: {
    tension: 65,
    friction: 8,
    useNativeDriver: true,
  },
  gentleSpring: {
    tension: 40,
    friction: 10,
    useNativeDriver: true,
  },

  // バウンスアニメーション
  bounce: {
    duration: 600,
    easing: Easing.bounce,
    useNativeDriver: true,
  },

  // 学習特化アニメーション
  correctAnswer: {
    duration: 400,
    easing: Easing.out(Easing.back(1.2)),
    useNativeDriver: true,
  },
  incorrectAnswer: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    useNativeDriver: true,
  },
} as const;

/**
 * アニメーション時間設定
 */
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  'very-slow': 800,
} as const;

/**
 * アニメーションフック
 */
export const useAnimations = () => {
  /**
   * 基本的なフェードアニメーション
   */
  const useFadeAnimation = (initialValue: number = 0) => {
    const opacity = useRef(new Animated.Value(initialValue)).current;

    const fadeIn = useCallback((config?: AnimationConfig) => {
      return Animated.timing(opacity, {
        toValue: 1,
        ...AnimationPresets.fadeIn,
        ...config,
      });
    }, [opacity]);

    const fadeOut = useCallback((config?: AnimationConfig) => {
      return Animated.timing(opacity, {
        toValue: 0,
        ...AnimationPresets.fadeOut,
        ...config,
      });
    }, [opacity]);

    const fadeTo = useCallback((toValue: number, config?: AnimationConfig) => {
      return Animated.timing(opacity, {
        toValue,
        duration: AnimationDurations.normal,
        easing: Easing.ease,
        useNativeDriver: true,
        ...config,
      });
    }, [opacity]);

    return { opacity, fadeIn, fadeOut, fadeTo };
  };

  /**
   * スケールアニメーション
   */
  const useScaleAnimation = (initialValue: number = 1) => {
    const scale = useRef(new Animated.Value(initialValue)).current;

    const scaleIn = useCallback((config?: AnimationConfig) => {
      return Animated.timing(scale, {
        toValue: 1,
        ...AnimationPresets.scaleIn,
        ...config,
      });
    }, [scale]);

    const scaleOut = useCallback((config?: AnimationConfig) => {
      return Animated.timing(scale, {
        toValue: 0,
        ...AnimationPresets.scaleOut,
        ...config,
      });
    }, [scale]);

    const scaleTo = useCallback((toValue: number, config?: AnimationConfig) => {
      return Animated.timing(scale, {
        toValue,
        duration: AnimationDurations.normal,
        easing: Easing.ease,
        useNativeDriver: true,
        ...config,
      });
    }, [scale]);

    const pulseScale = useCallback((config?: AnimationConfig) => {
      return Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
          ...config,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
          ...config,
        }),
      ]);
    }, [scale]);

    return { scale, scaleIn, scaleOut, scaleTo, pulseScale };
  };

  /**
   * スライドアニメーション
   */
  const useSlideAnimation = (initialValue: number = 0) => {
    const translateX = useRef(new Animated.Value(initialValue)).current;
    const translateY = useRef(new Animated.Value(initialValue)).current;

    const slideInFromRight = useCallback((fromValue: number = 300, config?: AnimationConfig) => {
      translateX.setValue(fromValue);
      return Animated.timing(translateX, {
        toValue: 0,
        ...AnimationPresets.slideInFromRight,
        ...config,
      });
    }, [translateX]);

    const slideInFromLeft = useCallback((fromValue: number = -300, config?: AnimationConfig) => {
      translateX.setValue(fromValue);
      return Animated.timing(translateX, {
        toValue: 0,
        ...AnimationPresets.slideInFromLeft,
        ...config,
      });
    }, [translateX]);

    const slideUp = useCallback((fromValue: number = 50, config?: AnimationConfig) => {
      translateY.setValue(fromValue);
      return Animated.timing(translateY, {
        toValue: 0,
        ...AnimationPresets.slideUp,
        ...config,
      });
    }, [translateY]);

    const slideDown = useCallback((fromValue: number = -50, config?: AnimationConfig) => {
      translateY.setValue(fromValue);
      return Animated.timing(translateY, {
        toValue: 0,
        ...AnimationPresets.slideDown,
        ...config,
      });
    }, [translateY]);

    return { 
      translateX, 
      translateY, 
      slideInFromRight, 
      slideInFromLeft, 
      slideUp, 
      slideDown 
    };
  };

  /**
   * スプリングアニメーション
   */
  const useSpringAnimation = (initialValue: number = 0) => {
    const springValue = useRef(new Animated.Value(initialValue)).current;

    const springTo = useCallback((toValue: number, config?: any) => {
      return Animated.spring(springValue, {
        toValue,
        ...AnimationPresets.spring,
        ...config,
      });
    }, [springValue]);

    const gentleSpringTo = useCallback((toValue: number, config?: any) => {
      return Animated.spring(springValue, {
        toValue,
        ...AnimationPresets.gentleSpring,
        ...config,
      });
    }, [springValue]);

    return { springValue, springTo, gentleSpringTo };
  };

  /**
   * 回転アニメーション
   */
  const useRotationAnimation = (initialValue: number = 0) => {
    const rotation = useRef(new Animated.Value(initialValue)).current;

    const rotateTo = useCallback((toValue: number, config?: AnimationConfig) => {
      return Animated.timing(rotation, {
        toValue,
        duration: AnimationDurations.normal,
        easing: Easing.ease,
        useNativeDriver: true,
        ...config,
      });
    }, [rotation]);

    const spin = useCallback((config?: AnimationConfig) => {
      rotation.setValue(0);
      return Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
          ...config,
        }),
        { iterations: config?.iterations || -1 }
      );
    }, [rotation]);

    const interpolateRotation = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return { rotation, rotateTo, spin, interpolateRotation };
  };

  /**
   * 学習コンテキスト特化アニメーション
   */
  const useLearningAnimations = () => {
    const { scale, pulseScale } = useScaleAnimation();
    const { opacity, fadeIn, fadeOut } = useFadeAnimation();
    const { springValue, springTo } = useSpringAnimation();

    // 正解時のアニメーション
    const correctAnswerAnimation = useCallback(() => {
      return Animated.sequence([
        Animated.parallel([
          fadeIn({ duration: 200 }),
          Animated.timing(scale, {
            toValue: 1.2,
            ...AnimationPresets.correctAnswer,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
    }, [scale, fadeIn]);

    // 不正解時のアニメーション（シェイク効果）
    const incorrectAnswerAnimation = useCallback(() => {
      return Animated.sequence([
        Animated.timing(springValue, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(springValue, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(springValue, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(springValue, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(springValue, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]);
    }, [springValue]);

    // レベルアップアニメーション
    const levelUpAnimation = useCallback(() => {
      return Animated.sequence([
        Animated.parallel([
          fadeIn({ duration: 300 }),
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 400,
            easing: Easing.out(Easing.back(1.7)),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(200),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
    }, [scale, fadeIn]);

    // ローディングアニメーション
    const loadingAnimation = useCallback(() => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    }, [opacity]);

    return {
      scale,
      opacity,
      springValue,
      correctAnswerAnimation,
      incorrectAnswerAnimation,
      levelUpAnimation,
      loadingAnimation,
      pulseScale,
    };
  };

  /**
   * 組み合わせアニメーション
   */
  const useCompositeAnimations = () => {
    const { opacity } = useFadeAnimation();
    const { scale } = useScaleAnimation(0.8);
    const { translateY } = useSlideAnimation(30);

    // モーダル表示アニメーション
    const modalEnterAnimation = useCallback(() => {
      return Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
    }, [opacity, scale, translateY]);

    // モーダル非表示アニメーション
    const modalExitAnimation = useCallback(() => {
      return Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 30,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]);
    }, [opacity, scale, translateY]);

    return { 
      opacity, 
      scale, 
      translateY, 
      modalEnterAnimation, 
      modalExitAnimation 
    };
  };

  return {
    useFadeAnimation,
    useScaleAnimation,
    useSlideAnimation,
    useSpringAnimation,
    useRotationAnimation,
    useLearningAnimations,
    useCompositeAnimations,
    AnimationPresets,
    AnimationDurations,
  };
};

/**
 * アニメーション対応コンポーネント
 */
export const AnimatedComponents = {
  /**
   * フェードイン対応View
   */
  FadeInView: ({ children, duration = 300, delay = 0, style }: {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    style?: any;
  }) => {
    const { opacity, fadeIn } = useAnimations().useFadeAnimation(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        fadeIn({ duration }).start();
      }, delay);
      return () => clearTimeout(timer);
    }, [fadeIn, duration, delay]);

    return (
      <Animated.View style={[style, { opacity }]}>
        {children}
      </Animated.View>
    );
  },

  /**
   * スライドイン対応View
   */
  SlideInView: ({ children, direction = 'up', duration = 300, delay = 0, style }: {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    style?: any;
  }) => {
    const { translateX, translateY, slideUp, slideDown, slideInFromLeft, slideInFromRight } = 
      useAnimations().useSlideAnimation();

    useEffect(() => {
      const timer = setTimeout(() => {
        switch (direction) {
          case 'up':
            slideUp(undefined, { duration }).start();
            break;
          case 'down':
            slideDown(undefined, { duration }).start();
            break;
          case 'left':
            slideInFromLeft(undefined, { duration }).start();
            break;
          case 'right':
            slideInFromRight(undefined, { duration }).start();
            break;
        }
      }, delay);
      return () => clearTimeout(timer);
    }, [direction, duration, delay]);

    const transform = direction === 'left' || direction === 'right' 
      ? [{ translateX }] 
      : [{ translateY }];

    return (
      <Animated.View style={[style, { transform }]}>
        {children}
      </Animated.View>
    );
  },

  /**
   * スケールイン対応View
   */
  ScaleInView: ({ children, duration = 300, delay = 0, style }: {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    style?: any;
  }) => {
    const { scale, scaleIn } = useAnimations().useScaleAnimation(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        scaleIn({ duration }).start();
      }, delay);
      return () => clearTimeout(timer);
    }, [scaleIn, duration, delay]);

    return (
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    );
  },
};

/**
 * パフォーマンス最適化のための設定
 */
export const enableLayoutAnimations = () => {
  if (Platform.OS === 'android') {
    // Android: LayoutAnimationを有効化
    try {
      const { LayoutAnimation } = require('react-native');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (error) {
      console.warn('LayoutAnimation not available:', error);
    }
  }
};

export default useAnimations;