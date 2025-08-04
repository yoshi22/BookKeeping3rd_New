/**
 * ヘルプ・ガイドシステム
 * 簿記3級問題集アプリ - Step 5.2: UX最適化
 * 
 * 包括的なユーザーサポート機能
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme, useThemedStyles } from '../../context/ThemeContext';
import { Typography, Heading } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardActions } from '../ui/Card';
import { FadeIn, SlideIn } from '../ui/Animation';
import { Screen, Container, Flex } from '../layout/ResponsiveLayout';

interface HelpItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  icon?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const helpCategories = [
  { id: 'basic', name: '基本操作', icon: '📱' },
  { id: 'learning', name: '学習機能', icon: '📚' },
  { id: 'review', name: '復習機能', icon: '🔄' },
  { id: 'exam', name: '模試機能', icon: '🎯' },
  { id: 'stats', name: '統計機能', icon: '📊' },
  { id: 'troubleshooting', name: 'トラブルシューティング', icon: '⚙️' },
];

const helpItems: HelpItem[] = [
  {
    id: 'app-overview',
    title: 'アプリの概要',
    content: `簿記3級確実復習は、間違えた問題を確実に潰すことに特化した学習アプリです。

主な特徴：
• 全302問（仕訳250問・帳簿40問・試算表12問）
• 間違い問題の優先復習システム
• CBT形式の模擬試験
• 完全オフライン対応
• プライバシー重視（個人情報非収集）`,
    category: 'basic',
    tags: ['概要', '機能', '問題数'],
    icon: '📚',
  },
  {
    id: 'learning-flow',
    title: '学習の進め方',
    content: `効果的な学習フローをご紹介します：

1. 分野選択
   仕訳・帳簿・試算表から学習したい分野を選択

2. 問題解答
   CBT形式で本番さながらの解答体験

3. 解説確認
   間違えた問題は詳しい解説で理解を深める

4. 復習実行
   間違えた問題は自動的に復習リストに追加

5. 模試受験
   総合力を確認し、弱点を発見`,
    category: 'learning',
    tags: ['学習', 'フロー', '進め方'],
    icon: '📖',
  },
  {
    id: 'review-system',
    title: '復習システムの仕組み',
    content: `間違えた問題を効率的に復習するシステムです：

優先度管理：
• 間違い回数が多いほど高優先度
• 最近間違えた問題ほど高優先度
• 連続正解で優先度が下がる

復習タイミング：
• 間違った直後
• 1日後、3日後、1週間後
• 記憶の定着を考慮した間隔

克服判定：
• 連続3回正解で「克服済み」
• 一定期間後に再復習を提案`,
    category: 'review',
    tags: ['復習', '優先度', 'アルゴリズム'],
    icon: '🔄',
  },
  {
    id: 'cbt-format',
    title: 'CBT形式について',
    content: `本番試験と同じCBT（Computer Based Testing）形式で学習できます：

仕訳問題：
• 借方・貸方の勘定科目をドロップダウンで選択
• 金額を数値入力
• 複合仕訳にも対応

帳簿問題：
• 取引内容をドロップダウンで選択
• 金額と摘要を入力

試算表問題：
• 各勘定科目の残高を入力
• 試算表の作成と検証

模擬試験：
• 第1問：仕訳15問（45点）
• 第2問：帳簿2問（20点）  
• 第3問：試算表1問（35点）
• 制限時間：60分`,
    category: 'exam',
    tags: ['CBT', '形式', '模試'],
    icon: '💻',
  },
  {
    id: 'statistics',
    title: '統計機能の見方',
    content: `学習の進捗を詳しく確認できます：

全体統計：
• 総解答数と正答率
• 分野別の進捗状況
• 学習時間の記録

分野別統計：
• 各分野の正答率
• 苦手な問題の特定
• 習熟度の推移

学習履歴：
• 日別・週別・月別の学習記録
• 解答パターンの分析
• 成長の可視化

模試結果：
• 各回の詳細な結果
• 合格判定（70点以上）
• 分野別の得点分析`,
    category: 'stats',
    tags: ['統計', '進捗', '分析'],
    icon: '📊',
  },
];

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: '問題数は何問ありますか？',
    answer: '全302問です。内訳は仕訳250問、帳簿40問、試算表12問となっています。簿記3級の出題範囲を網羅した問題構成になっています。',
    category: 'basic',
  },
  {
    id: 'faq-2',
    question: 'オフラインでも使用できますか？',
    answer: 'はい、完全オフライン対応です。インターネット接続は不要で、すべての機能をオフラインで利用できます。',
    category: 'basic',
  },
  {
    id: 'faq-3',
    question: '学習データは安全ですか？',
    answer: '学習データはすべてお使いの端末にローカル保存されます。外部サーバーへの送信は一切行わず、個人情報も収集していません。',
    category: 'basic',
  },
  {
    id: 'faq-4',
    question: '復習のタイミングはどのように決まりますか？',
    answer: '間違えた問題は記憶の定着を考慮し、1日後、3日後、1週間後のタイミングで復習が提案されます。連続正解により優先度が下がります。',
    category: 'review',
  },
  {
    id: 'faq-5',
    question: '模試の合格点は何点ですか？',
    answer: '70点以上が合格です。実際の簿記3級試験と同じ基準を採用しています。',
    category: 'exam',
  },
];

interface HelpSystemProps {
  visible: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export function HelpSystem({ visible, onClose, initialCategory }: HelpSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'basic');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const filteredHelpItems = helpItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Screen safeArea={true}>
        <Container>
          {/* ヘッダー */}
          <FadeIn>
            <View style={styles.header}>
              <Heading level={2}>ヘルプ・ガイド</Heading>
              <Button
                title="閉じる"
                variant="ghost"
                size="small"
                onPress={onClose}
              />
            </View>
          </FadeIn>

          {/* タブ切り替え */}
          <FadeIn delay={100}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'guide' && styles.tabActive]}
                onPress={() => setActiveTab('guide')}
              >
                <Typography 
                  variant="button" 
                  color={activeTab === 'guide' ? 'primary' : 'secondary'}
                >
                  使い方ガイド
                </Typography>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'faq' && styles.tabActive]}
                onPress={() => setActiveTab('faq')}
              >
                <Typography 
                  variant="button" 
                  color={activeTab === 'faq' ? 'primary' : 'secondary'}
                >
                  よくある質問
                </Typography>
              </TouchableOpacity>
            </View>
          </FadeIn>

          {/* カテゴリ選択 */}
          <FadeIn delay={200}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {helpCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Typography variant="body2" style={styles.categoryIcon}>
                    {category.icon}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={selectedCategory === category.id ? 'primary' : 'secondary'}
                    style={styles.categoryText}
                  >
                    {category.name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </FadeIn>

          {/* コンテンツ */}
          <View style={styles.content}>
            {activeTab === 'guide' ? (
              <HelpGuideContent items={filteredHelpItems} />
            ) : (
              <HelpFAQContent faqs={filteredFAQs} />
            )}
          </View>
        </Container>
      </Screen>
    </Modal>
  );
}

/**
 * ガイドコンテンツ
 */
interface HelpGuideContentProps {
  items: HelpItem[];
}

function HelpGuideContent({ items }: HelpGuideContentProps) {
  const styles = useThemedStyles(createStyles);

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography variant="h3" align="center">📝</Typography>
        <Typography variant="body1" align="center" color="secondary">
          該当するガイドが見つかりませんでした
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <SlideIn key={item.id} direction="up" delay={index * 100}>
          <HelpGuideItem item={item} />
        </SlideIn>
      ))}
    </ScrollView>
  );
}

/**
 * ガイドアイテム
 */
interface HelpGuideItemProps {
  item: HelpItem;
}

function HelpGuideItem({ item }: HelpGuideItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Card variant="outlined" style={styles.guideCard}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <CardHeader>
          <Flex direction="row" align="center" justify="space-between">
            <Flex direction="row" align="center" gap={theme.spacing.md}>
              {item.icon && (
                <Typography variant="h4">{item.icon}</Typography>
              )}
              <Typography variant="subtitle1">{item.title}</Typography>
            </Flex>
            <Typography variant="h5" color="secondary">
              {isExpanded ? '▼' : '▶'}
            </Typography>
          </Flex>
        </CardHeader>
      </TouchableOpacity>

      {isExpanded && (
        <FadeIn>
          <CardContent>
            <Typography variant="body2" style={styles.guideContent}>
              {item.content}
            </Typography>
            
            {item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Typography variant="caption" color="secondary">
                      {tag}
                    </Typography>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </FadeIn>
      )}
    </Card>
  );
}

/**
 * FAQ コンテンツ
 */
interface HelpFAQContentProps {
  faqs: FAQ[];
}

function HelpFAQContent({ faqs }: HelpFAQContentProps) {
  const styles = useThemedStyles(createStyles);

  if (faqs.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography variant="h3" align="center">❓</Typography>
        <Typography variant="body1" align="center" color="secondary">
          該当するFAQが見つかりませんでした
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
      {faqs.map((faq, index) => (
        <SlideIn key={faq.id} direction="up" delay={index * 100}>
          <FAQItem faq={faq} />
        </SlideIn>
      ))}
    </ScrollView>
  );
}

/**
 * FAQ アイテム
 */
interface FAQItemProps {
  faq: FAQ;
}

function FAQItem({ faq }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useThemedStyles(createStyles);

  return (
    <Card variant="outlined" style={styles.faqCard}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <CardHeader>
          <Flex direction="row" align="center" justify="space-between">
            <Typography variant="subtitle1" style={styles.question}>
              Q. {faq.question}
            </Typography>
            <Typography variant="h5" color="secondary">
              {isExpanded ? '▼' : '▶'}
            </Typography>
          </Flex>
        </CardHeader>
      </TouchableOpacity>

      {isExpanded && (
        <FadeIn>
          <CardContent>
            <Typography variant="body2" color="secondary" style={styles.answer}>
              A. {faq.answer}
            </Typography>
          </CardContent>
        </FadeIn>
      )}
    </Card>
  );
}

/**
 * ヘルプボタン（フローティング）
 */
interface HelpButtonProps {
  onPress: () => void;
}

export function HelpButton({ onPress }: HelpButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[styles.helpButton, { backgroundColor: theme.colors.primary }]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel="ヘルプを開く"
      accessibilityRole="button"
    >
      <Typography variant="h4" style={{ color: theme.colors.background }}>
        ❓
      </Typography>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.xs,
    marginVertical: theme.spacing.md,
  },

  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.xs,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.small,
  },

  categoryScroll: {
    marginBottom: theme.spacing.md,
  },

  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
  },

  categoryButton: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    minWidth: 80,
  },

  categoryButtonActive: {
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  categoryIcon: {
    marginBottom: theme.spacing.xs,
  },

  categoryText: {
    textAlign: 'center',
  },

  content: {
    flex: 1,
  },

  contentScroll: {
    flex: 1,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  guideCard: {
    marginBottom: theme.spacing.md,
  },

  guideContent: {
    lineHeight: theme.typography.body2.lineHeight * 1.6,
    marginBottom: theme.spacing.md,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.xs,
  },

  faqCard: {
    marginBottom: theme.spacing.md,
  },

  question: {
    flex: 1,
    marginRight: theme.spacing.md,
  },

  answer: {
    lineHeight: theme.typography.body2.lineHeight * 1.5,
  },

  helpButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
    zIndex: 1000,
  },
});

/**
 * ヘルプシステム管理フック
 */
export function useHelpSystem() {
  const [isVisible, setIsVisible] = useState(false);
  const [initialCategory, setInitialCategory] = useState<string>();

  const showHelp = (category?: string) => {
    setInitialCategory(category);
    setIsVisible(true);
  };

  const hideHelp = () => {
    setIsVisible(false);
    setInitialCategory(undefined);
  };

  return {
    isVisible,
    showHelp,
    hideHelp,
    initialCategory,
  };
}