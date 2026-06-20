import type { DiagnosisAnswers } from "@/lib/diagnosis/types";

export type DiagnosisQuestion = {
  id: keyof DiagnosisAnswers;
  label: string;
  helperText: string;
  options: [string, string, string, string];
};

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "q1",
    label: "現在のキャリアで最も感じていることは？",
    helperText: "いまの気持ちに最も近いものを選んでください",
    options: [
      "成長実感はあるが、方向性に迷っている",
      "日々の業務に追われ、将来が見えにくい",
      "今の仕事に満足しているが、さらに伸ばしたい",
      "環境や役割を見直したいと強く感じている",
    ],
  },
  {
    id: "q2",
    label: "仕事で最もやりがいを感じるのは？",
    helperText: "エネルギーが湧く場面に近いものを選んでください",
    options: [
      "人の役に立てたと実感できるとき",
      "新しいことを学び、成長できたとき",
      "自分のアイデアや提案が形になったとき",
      "チームをまとめ、成果を出せたとき",
    ],
  },
  {
    id: "q3",
    label: "3年後に実現したいキャリアのイメージは？",
    helperText: "理想に近い未来像を選んでください",
    options: [
      "専門性を深め、頼られる存在になりたい",
      "マネジメントやリーダーとして組織を牽引したい",
      "新しい分野やキャリアに挑戦したい",
      "ライフスタイルと両立できる働き方を確立したい",
    ],
  },
  {
    id: "q4",
    label: "自分の強みだと思うことは？",
    helperText: "最も当てはまるものを選んでください",
    options: [
      "課題を整理し、論理的に考える力",
      "人との関係を築き、巻き込む力",
      "粘り強く取り組み、成果を出す実行力",
      "発想力やクリエイティブな提案力",
    ],
  },
  {
    id: "q5",
    label: "キャリアで最も大切にしたい価値観は？",
    helperText: "譲れない条件に近いものを選んでください",
    options: [
      "学び続け、スキルを高め続けること",
      "収入や社会的評価を高めること",
      "ワークライフバランスと心の余裕",
      "社会や周囲への貢献・やりがい",
    ],
  },
];

export function createEmptyAnswers(): DiagnosisAnswers {
  return { q1: "", q2: "", q3: "", q4: "", q5: "" };
}

export function getQuestionById(id: keyof DiagnosisAnswers): DiagnosisQuestion | undefined {
  return DIAGNOSIS_QUESTIONS.find((question) => question.id === id);
}

export function isValidAnswer(questionId: keyof DiagnosisAnswers, value: string): boolean {
  const question = getQuestionById(questionId);
  if (!question) return false;
  return question.options.includes(value as DiagnosisQuestion["options"][number]);
}

export function validateAnswers(
  input: unknown,
): { ok: true; answers: DiagnosisAnswers } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "回答データが不正です" };
  }

  const body = input as Record<string, unknown>;
  const answers = createEmptyAnswers();

  for (const question of DIAGNOSIS_QUESTIONS) {
    const value = body[question.id];
    if (typeof value !== "string" || !value.trim()) {
      return { ok: false, error: `${question.label} を選択してください` };
    }
    if (!isValidAnswer(question.id, value.trim())) {
      return { ok: false, error: `${question.label} の選択肢が不正です` };
    }
    answers[question.id] = value.trim();
  }

  return { ok: true, answers };
}
