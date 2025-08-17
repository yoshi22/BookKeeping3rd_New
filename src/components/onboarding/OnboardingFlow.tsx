/**
 * オンボーディングフロー
 * 簿記3級問題集アプリ - Step 5.2: UX最適化
 * 
 * 初回利用時のユーザーガイド機能
 */

import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme, useThemedStyles, type Theme } from "../../context/ThemeContext";
import { Typography, Heading } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { FadeIn, SlideIn, ScaleIn } from '../ui/Animation';
import { Screen, Container } from '../layout/ResponsiveLayout';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  component?: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '簿記3級 確実復習へようこそ',
    description: '間違えた問題を確実に潰すシンプルで効果的な学習アプリです。あなたの合格をサポートします。',
    image: '📚',
  },
  {
    id: 'features',
    title: '3つの主要機能',
    description: '学習・復習・模試の3つの機能で効率的に学習を進められます。',
    component: (
      <FeaturesList />
    ),
  },
  {
    id: 'privacy',
    title: 'プライバシー重視',
    description: '個人情報は一切収集しません。すべてのデータはお使いの端末に安全に保存されます。',
    image: '🔒',
  },
  {
    id: 'offline',
    title: 'オフライン完結',
    description: 'インターネット接続は不要です。どこでも安心して学習できます。',
    image: '📱',
  },
  {
    id: 'start',
    title: '学習を始めましょう',
    description: '準備完了です！今すぐ学習を開始して、簿記3級合格を目指しましょう。',
    image: '🚀',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * screenWidth,
        animated: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollViewRef.current?.scrollTo({
        x: prevStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const stepIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentStep(stepIndex);
  };

  return (
    <Screen safeArea={true}>
      <Container>
        {/* ヘッダー */}
        <FadeIn>
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentStep && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
            
            <Button
              title="スキップ"
              variant="ghost"
              size="small"
              onPress={onSkip}
              style={styles.skipButton}
            />
          </View>
        </FadeIn>

        {/* ステップコンテンツ */}
        <View style={styles.contentContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
          >
            {onboardingSteps.map((step, index) => (
              <View key={step.id} style={styles.stepContainer}>
                <SlideIn
                  direction="right"
                  delay={index * 100}
                >
                  <OnboardingStep step={step} isActive={index === currentStep} />
                </SlideIn>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* フッター */}
        <FadeIn delay={500}>
          <View style={styles.footer}>
            <Button
              title="戻る"
              variant="outline"
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={styles.footerButton}
            />
            
            <Button
              title={isLastStep ? '学習開始' : '次へ'}
              variant="primary"
              onPress={handleNext}
              style={styles.footerButton}
            />
          </View>
        </FadeIn>
      </Container>
    </Screen>
  );
}

/**
 * 個別ステップコンポーネント
 */
interface OnboardingStepProps {
  step: OnboardingStep;
  isActive: boolean;
}

function OnboardingStep({ step, isActive }: OnboardingStepProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.step}>
      <Card variant="elevated" style={styles.stepCard}>
        <CardContent>
          {/* イメージまたはコンポーネント */}
          <View style={styles.stepImage}>
            {step.image ? (
              <ScaleIn fromScale={0.8} toScale={1} delay={isActive ? 200 : 0}>
                <Typography variant="h1" align="center">
                  {step.image}
                </Typography>
              </ScaleIn>
            ) : (
              step.component
            )}
          </View>

          {/* タイトル */}
          <FadeIn delay={isActive ? 300 : 0}>
            <Heading level={2} align="center" style={styles.stepTitle}>
              {step.title}
            </Heading>
          </FadeIn>

          {/* 説明 */}
          <FadeIn delay={isActive ? 400 : 0}>
            <Typography 
              variant="body1" 
              align="center" 
              color="secondary"
              style={styles.stepDescription}
            >
              {step.description}
            </Typography>
          </FadeIn>
        </CardContent>
      </Card>
    </View>
  );
}

/**
 * 機能一覧コンポーネント
 */
function FeaturesList() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const features = [
    {
      icon: '📚',
      title: '学習',
      description: '分野別に問題を解いて基礎力を向上',
    },
    {
      icon: '🔄',
      title: '復習',
      description: '間違えた問題を優先的に復習',
    },
    {
      icon: '🎯',
      title: '模試',
      description: 'CBT形式で本番さながらの模擬試験',
    },
  ];

  return (
    <View style={styles.featuresList}>
      {features.map((feature, index) => (
        <ScaleIn key={feature.title} delay={index * 100}>
          <Card variant="outlined" size="small" style={styles.featureCard}>
            <CardContent>
              <Typography variant="h2" align="center">
                {feature.icon}
              </Typography>
              <Typography variant="subtitle1" align="center" style={{ marginTop: theme.spacing.sm }}>
                {feature.title}
              </Typography>
              <Typography variant="caption" align="center" color="secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        </ScaleIn>
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textDisabled,
  },

  progressDotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },

  skipButton: {
    paddingHorizontal: theme.spacing.md,
  },

  contentContainer: {
    flex: 1,
  },

  stepContainer: {
    width: screenWidth - (theme.layoutSpacing.screenPadding * 2),
    justifyContent: 'center',
  },

  step: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },

  stepCard: {
    marginHorizontal: theme.spacing.lg,
  },

  stepImage: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    height: 120,
    justifyContent: 'center',
  },

  stepTitle: {
    marginBottom: theme.spacing.lg,
  },

  stepDescription: {
    lineHeight: theme.typography.body1.lineHeight * 1.5,
  },

  featuresList: {
    gap: theme.spacing.md,
  },

  featureCard: {
    alignItems: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  footerButton: {
    flex: 1,
  },
});

/**
 * オンボーディング状態管理フック
 */
export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const hasSeenOnboardingValue = await AsyncStorage.default.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(hasSeenOnboardingValue === 'true');
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.removeItem('hasSeenOnboarding');
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error('Failed to reset onboarding status:', error);
    }
  };

  return {
    hasSeenOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}