const fs = require("fs");
const path = require("path");

// 第2問の正答表示形式を修正するスクリプト
// CorrectAnswerExampleコンポーネントが期待する形式に合わせる
const filePath = path.join(__dirname, "../src/data/master-questions.ts");

const corrections = [
  // Q_L_001-010: 勘定記入問題
  {
    id: "Q_L_001",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "前月繰越 337,541円",
            amount: 337541,
          },
          {
            description: "現金売上 +276,641円",
            amount: 276641,
          },
          {
            description: "給料支払 -215,025円",
            amount: 215025,
          },
          {
            description: "売掛金回収 +184,924円",
            amount: 184924,
          },
          {
            description: "買掛金支払 -241,381円",
            amount: 241381,
          },
          {
            description: "現金過不足 -8,502円",
            amount: 8502,
          },
          {
            description: "月末残高",
            amount: 334198,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_002",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "前月繰越 564,069円",
            amount: 564069,
          },
          {
            description: "掛売上 +190,909円",
            amount: 190909,
          },
          {
            description: "現金回収 -51,829円",
            amount: 51829,
          },
          {
            description: "掛売上 +179,338円",
            amount: 179338,
          },
          {
            description: "手形回収 -111,922円",
            amount: 111922,
          },
          {
            description: "貸倒処理（引当金充当 -30,000円、損失 -5,813円）",
            amount: 35813,
          },
          {
            description: "月末残高",
            amount: 734752,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_003",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "期首商品棚卸高 914,556円",
            amount: 914556,
          },
          {
            description: "当期仕入高 1,404,670円",
            amount: 1404670,
          },
          {
            description: "期末商品棚卸高 -558,925円",
            amount: 558925,
          },
          {
            description: "売上原価",
            amount: 1760301,
          },
          {
            description: "売上総利益",
            amount: 65770,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_004",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "建物取得原価 4,960,026円",
            amount: 4960026,
          },
          {
            description: "減価償却累計額（前期末） -4,464,018円",
            amount: 4464018,
          },
          {
            description: "当期減価償却費 -248,001円",
            amount: 248001,
          },
          {
            description: "減価償却累計額（当期末） -4,712,019円",
            amount: 4712019,
          },
          {
            description: "帳簿価額",
            amount: 248007,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_005",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "前月繰越 523,589円",
            amount: 523589,
          },
          {
            description: "掛仕入 +393,285円",
            amount: 393285,
          },
          {
            description: "現金支払 -227,553円",
            amount: 227553,
          },
          {
            description: "売掛金相殺 -66,069円",
            amount: 66069,
          },
          {
            description: "月末残高",
            amount: 623252,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_006",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "前月繰越 725,963円",
            amount: 725963,
          },
          {
            description: "元本返済 -227,258円",
            amount: 227258,
          },
          {
            description: "追加借入 +135,870円",
            amount: 135870,
          },
          {
            description: "支払利息（別勘定） 20,524円",
            amount: 20524,
          },
          {
            description: "月末残高",
            amount: 634575,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_007",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "前月繰越 111,039円",
            amount: 111039,
          },
          {
            description: "貸倒れ充当 -17,606円",
            amount: 17606,
          },
          {
            description: "決算時繰入 +44,781円",
            amount: 44781,
          },
          {
            description: "戻入益 -11,908円",
            amount: 11908,
          },
          {
            description: "月末残高",
            amount: 126306,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_008",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "現金売上 397,451円",
            amount: 397451,
          },
          {
            description: "掛売上 596,176円",
            amount: 596176,
          },
          {
            description: "売上高合計",
            amount: 993627,
          },
          {
            description: "現金仕入 260,123円",
            amount: 260123,
          },
          {
            description: "掛仕入 606,954円",
            amount: 606954,
          },
          {
            description: "仕入高合計",
            amount: 867077,
          },
          {
            description: "売上総利益",
            amount: 126550,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_009",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "11月25日 給料支払",
            amount: 321134,
          },
          {
            description: "未払給料（26日〜30日の5日分）",
            amount: 53522,
          },
          {
            description: "当月費用計上額",
            amount: 374656,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_010",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "仕入（借方） 300,000円",
            amount: 300000,
          },
          {
            description: "支払手数料（借方） 5,000円",
            amount: 5000,
          },
          {
            description: "現金（貸方） 100,000円",
            amount: 100000,
          },
          {
            description: "買掛金（貸方） 200,000円",
            amount: 200000,
          },
          {
            description: "未払金（貸方） 5,000円",
            amount: 5000,
          },
          {
            description: "相手勘定：諸口",
            amount: 0,
          },
        ],
      },
    }),
  },

  // Q_L_011-020: 補助簿記入問題
  {
    id: "Q_L_011",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "6月1日 前月繰越 333,931円",
            amount: 333931,
          },
          {
            description: "6月5日 売掛金回収 +125,500円",
            amount: 125500,
          },
          {
            description: "6月8日 現金売上 +87,300円",
            amount: 87300,
          },
          {
            description: "6月12日 仕入支払 -156,200円",
            amount: 156200,
          },
          {
            description: "6月18日 給料支払 -95,000円",
            amount: 95000,
          },
          {
            description: "6月25日 経費支払 -35,800円",
            amount: 35800,
          },
          {
            description: "6月30日 次月繰越",
            amount: 259731,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_012",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "3月1日 前月繰越 455,377円",
            amount: 455377,
          },
          {
            description: "3月3日 売上代金振込 +250,000円",
            amount: 250000,
          },
          {
            description: "3月10日 小切手振出 -180,000円",
            amount: 180000,
          },
          {
            description: "3月15日 手形取立 +95,000円",
            amount: 95000,
          },
          {
            description: "3月20日 買掛金支払 -210,000円",
            amount: 210000,
          },
          {
            description: "3月28日 経費引落 -45,000円",
            amount: 45000,
          },
          {
            description: "3月31日 次月繰越",
            amount: 365377,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_013",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "4月1日 前月繰越 100,326円",
            amount: 100326,
          },
          {
            description: "4月5日 補給 +50,000円",
            amount: 50000,
          },
          {
            description: "4月8日 交通費 -3,500円",
            amount: 3500,
          },
          {
            description: "4月12日 消耗品費 -8,200円",
            amount: 8200,
          },
          {
            description: "4月18日 通信費 -2,800円",
            amount: 2800,
          },
          {
            description: "4月25日 雑費 -1,500円",
            amount: 1500,
          },
          {
            description: "4月30日 補給 +16,000円（定額補充）",
            amount: 16000,
          },
          {
            description: "4月30日 次月繰越",
            amount: 150326,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_014",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "2月1日 前月繰越 408,537円",
            amount: 408537,
          },
          {
            description: "2月5日 定期預入 +100,000円",
            amount: 100000,
          },
          {
            description: "2月10日 売上代金預入 +85,000円",
            amount: 85000,
          },
          {
            description: "2月15日 経費支払 -120,000円",
            amount: 120000,
          },
          {
            description: "2月20日 給料振込 -95,000円",
            amount: 95000,
          },
          {
            description: "2月28日 利息 +63円",
            amount: 63,
          },
          {
            description: "2月28日 次月繰越",
            amount: 378600,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_015",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "9月3日 A商店 商品A 100個×1,200円",
            amount: 120000,
          },
          {
            description: "9月8日 B商店 商品B 80個×1,500円",
            amount: 120000,
          },
          {
            description: "9月15日 C商店 商品A 120個×1,180円",
            amount: 141600,
          },
          {
            description: "9月22日 A商店 商品C 50個×2,000円",
            amount: 100000,
          },
          {
            description: "9月28日 D商店 商品B 60個×1,480円",
            amount: 88800,
          },
          {
            description: "仕入合計",
            amount: 570400,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_016",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "2月2日 甲社 製品X 50個×3,000円",
            amount: 150000,
          },
          {
            description: "2月8日 乙社 製品Y 30個×4,500円",
            amount: 135000,
          },
          {
            description: "2月15日 丙社 製品X 40個×2,950円",
            amount: 118000,
          },
          {
            description: "2月22日 甲社 製品Z 25個×5,000円",
            amount: 125000,
          },
          {
            description: "2月28日 丁社 製品Y 35個×4,400円",
            amount: 154000,
          },
          {
            description: "売上合計",
            amount: 682000,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_017",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "10月1日 前月繰越 100個@1,000円",
            amount: 100000,
          },
          {
            description: "10月5日 仕入 150個@1,100円",
            amount: 165000,
          },
          {
            description: "10月10日 売上 80個（先入先出法により@1,000円）",
            amount: 80000,
          },
          {
            description: "10月18日 仕入 100個@1,050円",
            amount: 105000,
          },
          {
            description: "10月25日 売上 120個（20個@1,000円+100個@1,100円）",
            amount: 128000,
          },
          {
            description:
              "10月31日 期末在庫 150個（50個@1,100円+100個@1,050円）",
            amount: 162000,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_018",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "6月1日 前月繰越 200個@2,000円",
            amount: 400000,
          },
          {
            description: "6月5日 仕入 300個@2,100円（平均単価@2,060円）",
            amount: 630000,
          },
          {
            description: "6月10日 売上 150個@2,060円",
            amount: 309000,
          },
          {
            description: "6月18日 仕入 200個@2,050円（平均単価@2,056円）",
            amount: 410000,
          },
          {
            description: "6月25日 売上 250個@2,056円",
            amount: 514000,
          },
          {
            description: "6月30日 期末在庫 300個@2,056円",
            amount: 617000,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_019",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "売掛金元帳 A社：期首250,000円→期末230,000円",
            amount: 230000,
          },
          {
            description: "売掛金元帳 B社：期首180,000円→期末160,000円",
            amount: 160000,
          },
          {
            description: "売掛金元帳 C社：期首95,000円→期末115,000円",
            amount: 115000,
          },
          {
            description: "買掛金元帳 X商店：期首180,000円→期末170,000円",
            amount: 170000,
          },
          {
            description: "買掛金元帳 Y商店：期首120,000円→期末130,000円",
            amount: 130000,
          },
          {
            description: "買掛金元帳 Z商店：期首85,000円→期末90,000円",
            amount: 90000,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_020",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "受取手形 甲社 150,000円（3/5期日）保有中",
            amount: 150000,
          },
          {
            description: "受取手形 乙社 200,000円（3/12期日）割引済",
            amount: 200000,
          },
          {
            description: "受取手形 丙社 180,000円（4/20期日）裏書済",
            amount: 180000,
          },
          {
            description: "受取手形 丁社 250,000円（4/25期日）保有中",
            amount: 250000,
          },
          {
            description: "支払手形 A商店 180,000円（3/8期日）",
            amount: 180000,
          },
          {
            description: "支払手形 B商店 220,000円（3/15期日）",
            amount: 220000,
          },
          {
            description: "支払手形 C商店 195,000円（4/28期日）",
            amount: 195000,
          },
          {
            description: "偶発債務（割引・裏書分）",
            amount: 380000,
          },
        ],
      },
    }),
  },

  // Q_L_021-030: 伝票記入問題
  {
    id: "Q_L_021",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【入金伝票】5月1日 売掛金回収",
            amount: 319066,
          },
          {
            description: "【入金伝票】5月20日 現金売上",
            amount: 386900,
          },
          {
            description: "【入金伝票】5月27日 受取手形決済",
            amount: 627660,
          },
          {
            description: "入金合計",
            amount: 1333626,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_022",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【出金伝票】2月8日 現金仕入",
            amount: 666219,
          },
          {
            description: "【出金伝票】2月15日 買掛金支払",
            amount: 572665,
          },
          {
            description: "【出金伝票】2月24日 諸経費支払",
            amount: 682448,
          },
          {
            description: "出金合計",
            amount: 1921332,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_023",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【振替伝票】8月3日 売掛金/売上（掛売上）",
            amount: 301530,
          },
          {
            description: "【振替伝票】8月7日 仕入/買掛金（掛仕入）",
            amount: 280539,
          },
          {
            description: "【振替伝票】8月12日 買掛金/支払手形（手形振出）",
            amount: 406302,
          },
          {
            description: "振替合計",
            amount: 988371,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_024",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【振替伝票】9月11日 仕入/買掛金（掛仕入）",
            amount: 151791,
          },
          {
            description: "【振替伝票】9月24日 売掛金/売上（掛売上）",
            amount: 191383,
          },
          {
            description: "【振替伝票】9月27日 買掛金/売掛金（相殺）",
            amount: 85665,
          },
          {
            description: "振替合計",
            amount: 428839,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_025",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description:
              "5月13日 売上252,840円（現金150,000円＋掛け102,840円）",
            amount: 252840,
          },
          {
            description: "【入金伝票】現金部分",
            amount: 150000,
          },
          {
            description: "【振替伝票】掛け部分",
            amount: 102840,
          },
          {
            description:
              "5月27日 仕入235,649円（現金100,000円＋掛け135,649円）",
            amount: 235649,
          },
          {
            description: "5月28日 売上248,951円（現金180,000円＋掛け68,951円）",
            amount: 248951,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_026",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【入金伝票集計】現金収入",
            amount: 450000,
          },
          {
            description: "【出金伝票集計】現金支出",
            amount: 380000,
          },
          {
            description: "【振替伝票】仕入/買掛金",
            amount: 159981,
          },
          {
            description: "【振替伝票】売掛金/売上",
            amount: 300530,
          },
          {
            description: "【振替伝票】買掛金/支払手形",
            amount: 125950,
          },
          {
            description: "仕訳日計表 借方・貸方合計",
            amount: 1416461,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_027",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【売上伝票】11月7日 A社 掛売上",
            amount: 705035,
          },
          {
            description: "【売上伝票】11月18日 B社 現金売上",
            amount: 296150,
          },
          {
            description: "【売上伝票】11月22日 C社 掛売上",
            amount: 526373,
          },
          {
            description: "売上合計（現金296,150円＋掛け1,231,408円）",
            amount: 1527558,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_028",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【仕入伝票】4月11日 X商店 掛仕入",
            amount: 197758,
          },
          {
            description: "【仕入伝票】4月17日 Y商店 現金仕入",
            amount: 178273,
          },
          {
            description: "【仕入伝票】4月28日 Z商店 掛仕入",
            amount: 155282,
          },
          {
            description: "仕入合計（現金178,273円＋掛け353,040円）",
            amount: 531313,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_029",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "4月8日 商品売上436,244円→【売上伝票】",
            amount: 436244,
          },
          {
            description: "4月25日 商品仕入611,082円→【仕入伝票】",
            amount: 611082,
          },
          {
            description: "4月25日 売掛金回収739,173円→【入金伝票】",
            amount: 739173,
          },
          {
            description:
              "5伝票制：売上・仕入は専用伝票、現金収支は入金・出金伝票",
            amount: 0,
          },
        ],
      },
    }),
  },
  {
    id: "Q_L_030",
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          {
            description: "【売上伝票】8月8日",
            amount: 605681,
          },
          {
            description: "【仕入伝票】8月8日",
            amount: 700622,
          },
          {
            description: "【振替伝票】8月4日",
            amount: 764578,
          },
          {
            description: "総勘定元帳への転記 借方合計",
            amount: 1306303,
          },
          {
            description: "総勘定元帳への転記 貸方合計",
            amount: 1306303,
          },
        ],
      },
    }),
  },
];

// ファイルを読み込み
let content = fs.readFileSync(filePath, "utf8");

// 各問題を修正
corrections.forEach((correction) => {
  // 正答データの修正
  const correctAnswerRegex = new RegExp(
    `(id: "${correction.id}"[\\s\\S]*?)correct_answer_json:\\s*'[^']*'`,
    "g",
  );
  content = content.replace(
    correctAnswerRegex,
    `$1correct_answer_json:\n      '${correction.correct_answer_json}'`,
  );
});

// ファイルに書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log("✅ Q_L_001〜Q_L_030の表示形式を修正しました");
console.log("修正内容:");
console.log("- ledgerEntries等の新形式をledgerEntry.entriesの既存形式に変換");
console.log("- 各エントリーにdescriptionとamountを設定");
console.log("- CorrectAnswerExampleコンポーネントで正しく表示されるように調整");
