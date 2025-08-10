import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import JournalEntryForm, { JournalEntry } from "./JournalEntryForm";
import { Screen } from "../layout/ResponsiveLayout";

const SAMPLE_QUESTION = `商品300,000円を仕入れ、代金のうち200,000円は掛けとし、50,000円は約束手形を振り出し、残額は現金で支払った。

上記の取引について、仕訳を行いなさい。`;

export default function JournalEntryDemo() {
  const handleSubmit = (debits: JournalEntry[], credits: JournalEntry[]) => {
    console.log("仕訳提出:", { debits, credits });

    // デバッグ用アラート
    const debitText = debits
      .map((d) => `${d.account} ${d.amount.toLocaleString()}円`)
      .join("\n");
    const creditText = credits
      .map((c) => `${c.account} ${c.amount.toLocaleString()}円`)
      .join("\n");

    Alert.alert(
      "解答を提出しました",
      `借方:\n${debitText}\n\n貸方:\n${creditText}`,
      [{ text: "OK", onPress: () => console.log("仕訳解答完了") }],
    );
  };

  const handleNext = () => {
    Alert.alert("次の問題", "次の問題に進みます");
  };

  const handlePrevious = () => {
    Alert.alert("前の問題", "前の問題に戻ります");
  };

  return (
    <Screen>
      <View style={styles.container}>
        <JournalEntryForm
          questionText={SAMPLE_QUESTION}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onPrevious={handlePrevious}
          questionNumber={1}
          totalQuestions={15}
          timeRemaining="45:30"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
