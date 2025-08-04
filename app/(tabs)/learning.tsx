import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LearningScreen() {
  const router = useRouter();
  const categories = [
    {
      id: 'journal',
      name: '仕訳',
      description: '基本的な仕訳問題',
      totalQuestions: 250,
      completedQuestions: 0,
      icon: '📝'
    },
    {
      id: 'ledger',
      name: '帳簿',
      description: '元帳・補助簿問題',
      totalQuestions: 40,
      completedQuestions: 0,
      icon: '📋'
    },
    {
      id: 'trial_balance',
      name: '試算表',
      description: '試算表作成・修正問題',
      totalQuestions: 12,
      completedQuestions: 0,
      icon: '📊'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>学習モード</Text>
        <Text style={styles.subtitle}>カテゴリを選択して学習を開始</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={styles.categoryCard}
            onPress={() => {
              // サンプル問題の最初の問題に遷移
              let firstQuestionId = '';
              switch (category.id) {
                case 'journal':
                  firstQuestionId = 'Q_J_001';
                  break;
                case 'ledger':
                  firstQuestionId = 'Q_L_001';
                  break;
                case 'trial_balance':
                  firstQuestionId = 'Q_T_001';
                  break;
              }
              
              if (firstQuestionId) {
                router.push(`/question/${firstQuestionId}`);
              }
            }}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <Text style={styles.categoryProgress}>
                {category.completedQuestions}/{category.totalQuestions}問完了
              </Text>
            </View>
            <View style={styles.categoryAction}>
              <Text style={styles.actionText}>開始</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.mockExamSection}>
        <TouchableOpacity 
          style={styles.mockExamButton}
          onPress={() => {
            // TODO: Navigate to mock exam
            console.log('Start mock exam');
          }}
        >
          <Text style={styles.mockExamIcon}>🎯</Text>
          <Text style={styles.mockExamTitle}>模擬試験</Text>
          <Text style={styles.mockExamSubtitle}>本試験形式で実力チェック</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2f95dc',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  categoryProgress: {
    fontSize: 12,
    color: '#2f95dc',
  },
  categoryAction: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#2f95dc',
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mockExamSection: {
    padding: 20,
  },
  mockExamButton: {
    backgroundColor: '#ff6b35',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mockExamIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  mockExamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  mockExamSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});