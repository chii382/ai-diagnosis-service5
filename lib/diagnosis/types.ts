export type DiagnosisAnswers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

export type CareerRoadmapPhase = {
  period: string;
  goals: string[];
  actions: string[];
};

export type CareerRoadmap = {
  shortTerm: CareerRoadmapPhase;
  midTerm: CareerRoadmapPhase;
  longTerm: CareerRoadmapPhase;
};

export type DiagnosisResult = {
  summary: string;
  strengths: string[];
  recommendedDirections: string[];
  advice: string;
};

/** 無料プラン向けの簡潔な診断結果 */
export type DiagnosisResultBrief = {
  summary: string;
  strengths: string[];
  recommendedDirections: string[];
  advice: string;
};

export type CareerRoadmapPhaseBrief = {
  period: string;
  /** 80〜120文字程度。方向性と達成イメージを2文程度で */
  overview: string;
  /** 方針レベルの要点（各40文字以内・2件）。具体アクションは含めない */
  highlights: string[];
};

/** 無料プラン向けの簡易ロードマップ */
export type CareerRoadmapBrief = {
  shortTerm: CareerRoadmapPhaseBrief;
  midTerm: CareerRoadmapPhaseBrief;
  longTerm: CareerRoadmapPhaseBrief;
};

export type DiagnosisDocument = {
  _id: string;
  userId: string;
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  resultBrief?: DiagnosisResultBrief;
  careerRoadmap: CareerRoadmap;
  careerRoadmapBrief?: CareerRoadmapBrief;
  createdAt: string;
  updatedAt: string;
};

export type DiagnosisListItem = {
  id: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};
