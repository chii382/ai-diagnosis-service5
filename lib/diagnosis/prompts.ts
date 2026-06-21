import {
  formatProfileContextSection,
  type DiagnosisProfileContext,
} from "@/lib/diagnosis/profile-context";
import type { DiagnosisAnswers } from "@/lib/diagnosis/types";
import { DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";

export function buildDiagnosisPrompt(
  answers: DiagnosisAnswers,
  profileContext?: DiagnosisProfileContext | null,
): string {
  const qa = DIAGNOSIS_QUESTIONS.map((q) => {
    const selected = answers[q.id];
    const index = q.options.findIndex((option) => option === selected);
    const label = index >= 0 ? `選択肢${index + 1}` : "選択回答";
    return `【${q.label}】\n${label}: ${selected}`;
  }).join("\n\n");

  const profileSection = profileContext
    ? `

## プロフィール情報
ユーザーがプロフィール画面で入力した以下の情報も診断に反映してください。
5問の回答を主軸とし、プロフィール情報で背景・文脈・具体性を補強してください。

${formatProfileContextSection(profileContext)}
`
    : "";

  return `あなたはキャリアカウンセラーのAIです。以下の5問の回答をもとに、日本語でキャリア診断結果を作成してください。${profileSection}

## 回答
${qa}

## 出力形式
必ず次のJSON形式のみを返してください。Markdownや説明文は不要です。
result は有料プラン向けの詳細版、resultBrief / careerRoadmapBrief は無料プラン向けの簡潔版です。

{
  "result": {
    "summary": "200文字程度の総合診断サマリー",
    "strengths": ["強み1", "強み2", "強み3"],
    "recommendedDirections": ["おすすめの方向性1", "おすすめの方向性2", "おすすめの方向性3"],
    "advice": "150文字程度の具体的アドバイス"
  },
  "resultBrief": {
    "summary": "80文字以内の要点サマリー",
    "strengths": ["代表する強み1つ"],
    "recommendedDirections": ["おすすめの方向性1つ"],
    "advice": "60文字以内のひと言アドバイス"
  },
  "careerRoadmap": {
    "shortTerm": {
      "period": "0〜6ヶ月",
      "goals": ["短期目標1", "短期目標2"],
      "actions": ["短期アクション1", "短期アクション2", "短期アクション3"]
    },
    "midTerm": {
      "period": "6ヶ月〜2年",
      "goals": ["中期目標1", "中期目標2"],
      "actions": ["中期アクション1", "中期アクション2", "中期アクション3"]
    },
    "longTerm": {
      "period": "2〜5年",
      "goals": ["長期目標1", "長期目標2"],
      "actions": ["長期アクション1", "長期アクション2", "長期アクション3"]
    }
  },
  "careerRoadmapBrief": {
    "shortTerm": {
      "period": "0〜6ヶ月",
      "overview": "80〜120文字。今の状況整理と次の一歩の方向性、期待できる変化を2文程度で",
      "highlights": ["方針の要点1（40文字以内）", "方針の要点2（40文字以内）"]
    },
    "midTerm": {
      "period": "6ヶ月〜2年",
      "overview": "80〜120文字。中期的な成長テーマとキャリア上の位置づけを2文程度で",
      "highlights": ["方針の要点1", "方針の要点2"]
    },
    "longTerm": {
      "period": "2〜5年",
      "overview": "80〜120文字。理想のキャリア像と実現後の状態を2文程度で",
      "highlights": ["方針の要点1", "方針の要点2"]
    }
  }
}

## careerRoadmapBrief の書き方（重要）
- 無料プラン向け。読みやすく、プロフェッショナルな日本語にする
- overview は各期間80〜120文字。方向性・期待成果・キャリア上の意味を2文程度で述べる
- overview / summary / advice は省略記号（…）を使わず、必ず句点（。）で終わる完全な文にする
- highlights は方針レベルの要点を2つ（各40文字以内）。手順・数値・具体的アクションは書かない
- 有料版 careerRoadmap との差: 有料版は goals/actions で具体化。簡易版は「方針と展望」に留め、詳細手順は書かない`;
}
