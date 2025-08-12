const fs = require("fs");
const path = require("path");

console.log("🔧 ExplanationPanelに伝票と選択問題の表示処理を追加\n");
console.log("=" * 60 + "\n");

const explanationPanelPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "ExplanationPanel.tsx",
);

let content = fs.readFileSync(explanationPanelPath, "utf8");

// 伝票表示処理の追加コード
const voucherDisplayCode = `
    // 伝票問題の場合（vouchers配列）
    if (correctAnswer.vouchers && Array.isArray(correctAnswer.vouchers)) {
      const vouchers = correctAnswer.vouchers;
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          {vouchers.map((voucher: any, vIndex: number) => (
            <View key={vIndex} style={styles.voucherBox}>
              <Text style={styles.voucherTitle}>{voucher.type}</Text>
              {voucher.entries && voucher.entries.map((entry: any, eIndex: number) => (
                <View key={eIndex} style={styles.voucherEntry}>
                  {entry.date && (
                    <Text style={styles.entryText}>日付: {entry.date}</Text>
                  )}
                  {entry.account && (
                    <Text style={styles.entryText}>勘定科目: {entry.account}</Text>
                  )}
                  {entry.amount !== undefined && (
                    <Text style={styles.entryText}>金額: {formatAnswerValue(entry.amount)}円</Text>
                  )}
                  {entry.debit_account && (
                    <Text style={styles.entryText}>借方科目: {entry.debit_account}</Text>
                  )}
                  {entry.debit_amount !== undefined && (
                    <Text style={styles.entryText}>借方金額: {formatAnswerValue(entry.debit_amount)}円</Text>
                  )}
                  {entry.credit_account && (
                    <Text style={styles.entryText}>貸方科目: {entry.credit_account}</Text>
                  )}
                  {entry.credit_amount !== undefined && (
                    <Text style={styles.entryText}>貸方金額: {formatAnswerValue(entry.credit_amount)}円</Text>
                  )}
                  {entry.description && (
                    <Text style={styles.entryText}>摘要: {entry.description}</Text>
                  )}
                  {entry.customer && (
                    <Text style={styles.entryText}>得意先: {entry.customer}</Text>
                  )}
                  {entry.supplier && (
                    <Text style={styles.entryText}>仕入先: {entry.supplier}</Text>
                  )}
                  {entry.payment_type && (
                    <Text style={styles.entryText}>取引区分: {entry.payment_type}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }

    // 選択問題の場合（single_choice/multiple_choice）
    if (correctAnswer.selected !== undefined || correctAnswer.selected_options !== undefined) {
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          <View style={styles.choiceAnswerBox}>
            {correctAnswer.selected !== undefined ? (
              <Text style={styles.selectedText}>
                正解: {correctAnswer.selected}番
              </Text>
            ) : correctAnswer.selected_options ? (
              <Text style={styles.selectedText}>
                正解: {correctAnswer.selected_options.join(", ")}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }
`;

// renderCorrectAnswer関数の最初に伝票と選択問題の処理を追加
const insertPosition = content.indexOf("// 帳簿問題（複数エントリ）の場合");
if (insertPosition > -1) {
  content =
    content.substring(0, insertPosition) +
    voucherDisplayCode +
    "\n\n    " +
    content.substring(insertPosition);
  console.log("✅ 伝票と選択問題の表示処理を追加");
}

// スタイルの追加
const additionalStyles = `
  voucherBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  voucherEntry: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  choiceAnswerBox: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a90e2",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },`;

// スタイルを追加
const stylesEndPosition = content.lastIndexOf("});");
if (stylesEndPosition > -1) {
  content =
    content.substring(0, stylesEndPosition) +
    additionalStyles +
    "\n" +
    content.substring(stylesEndPosition);
  console.log("✅ スタイル定義を追加");
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(explanationPanelPath, content);

console.log("\n✅ ExplanationPanelの修正完了！");
console.log("伝票と選択問題の正答が正しく表示されるようになりました。");
