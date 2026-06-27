import type { OccupationValue } from "@/lib/profile-options";

export type CareerPathCategory = {
  id: string;
  label: string;
};

export type CareerPathPattern = {
  id: string;
  categoryId: string;
  /** 「ずばりあなたのキャリアパスは？」および TOP10 集計ラベル */
  label: string;
  /** AI 選定用の説明 */
  guide: string;
  occupationHints?: OccupationValue[];
};

export const CAREER_PATH_CATEGORIES: CareerPathCategory[] = [
  { id: "specialist", label: "専門深化型" },
  { id: "manager", label: "マネジメント・リーダー型" },
  { id: "hybrid", label: "ハイブリッド型" },
  { id: "career_change", label: "キャリアチェンジ型" },
  { id: "work_life", label: "ワークライフ両立型" },
  { id: "creative", label: "クリエイティブ・企画型" },
  { id: "social", label: "社会貢献・公共型" },
  { id: "ai_digital", label: "AI・デジタル型" },
  { id: "startup", label: "挑戦・スタートアップ型" },
];

export const CAREER_PATH_PATTERNS: CareerPathPattern[] = [
  // specialist (6)
  { id: "specialist_core", categoryId: "specialist", label: "現職で専門性を極める路線", guide: "今の職域で深く掘り下げて頼られる存在になる" },
  { id: "specialist_cert", categoryId: "specialist", label: "資格・学習で専門性を高める路線", guide: "資格取得や体系的学习で専門性を強化する", occupationHints: ["office_worker", "service"] },
  { id: "specialist_technical", categoryId: "specialist", label: "技術深度を追求する路線", guide: "技術・実装・工学の深さを追求する", occupationHints: ["engineer", "manufacturing"] },
  { id: "specialist_consulting", categoryId: "specialist", label: "専門知識で支援する路線", guide: "専門知識を活かして他者・組織を支援する", occupationHints: ["consultant"] },
  { id: "specialist_research", categoryId: "specialist", label: "分析・研究特化路線", guide: "調査・分析・研究で価値を出す", occupationHints: ["education"] },
  { id: "specialist_sales", categoryId: "specialist", label: "営業プロとして専門性を深める路線", guide: "営業・提案のプロとして深耕する", occupationHints: ["sales"] },
  // manager (6)
  { id: "manager_team", categoryId: "manager", label: "チームリーダーへの成長路線", guide: "小規模チームのリーダーとして成果を出す" },
  { id: "manager_project", categoryId: "manager", label: "プロジェクトリーダー路線", guide: "プロジェクトを牽引するリーダーになる", occupationHints: ["engineer", "consultant"] },
  { id: "manager_department", categoryId: "manager", label: "部門マネージャー路線", guide: "部門・組織単位のマネジメントを担う", occupationHints: ["manager", "office_worker"] },
  { id: "manager_people", categoryId: "manager", label: "ピープルマネジメント特化路線", guide: "人材育成・組織づくりに軸を置く", occupationHints: ["service", "medical"] },
  { id: "manager_strategy", categoryId: "manager", label: "戦略立案・組織運営路線", guide: "戦略と組織運営で組織を動かす", occupationHints: ["manager", "consultant"] },
  { id: "manager_executive", categoryId: "manager", label: "経営・役員候補路線", guide: "経営視点・意思決定層を目指す", occupationHints: ["manager"] },
  // hybrid (6)
  { id: "hybrid_tech_lead", categoryId: "hybrid", label: "テックリード路線", guide: "技術とチーム牽引を両立する", occupationHints: ["engineer"] },
  { id: "hybrid_product", categoryId: "hybrid", label: "プロダクトマネージャー路線", guide: "企画・開発・ビジネスをつなぐ", occupationHints: ["engineer", "marketing"] },
  { id: "hybrid_dx", categoryId: "hybrid", label: "DX推進リーダー路線", guide: "デジタル変革を現場で推進する", occupationHints: ["engineer", "office_worker"] },
  { id: "hybrid_sales_engineer", categoryId: "hybrid", label: "技術×営業ハイブリッド路線", guide: "技術理解と営業力を組み合わせる", occupationHints: ["sales", "engineer"] },
  { id: "hybrid_consulting", categoryId: "hybrid", label: "コンサル×専門ハイブリッド路線", guide: "専門性とコンサルティングを融合", occupationHints: ["consultant"] },
  { id: "hybrid_cross", categoryId: "hybrid", label: "異業種連携・調整路線", guide: "部門・業種を横断して価値を生む", occupationHints: ["office_worker", "marketing"] },
  // career_change (6)
  { id: "career_change_industry", categoryId: "career_change", label: "業界転換路線", guide: "同職種で業界を変える" },
  { id: "career_change_role", categoryId: "career_change", label: "職種転換路線", guide: "別職種・別役割へ転換する" },
  { id: "career_change_freelance", categoryId: "career_change", label: "独立・フリーランス路線", guide: "独立して自分の事業・案件で働く", occupationHints: ["freelance"] },
  { id: "career_change_side", categoryId: "career_change", label: "副業から本業への転換路線", guide: "副業・スキルを本業化する", occupationHints: ["freelance", "part_time"] },
  { id: "career_change_second", categoryId: "career_change", label: "セカンドキャリア路線", guide: "人生後半のキャリア再構築", occupationHints: ["other"] },
  { id: "career_change_overseas", categoryId: "career_change", label: "グローバル挑戦路線", guide: "海外・グローバル環境への挑戦" },
  // work_life (6)
  { id: "work_life_balance", categoryId: "work_life", label: "ワークライフ両立重視路線", guide: "仕事と生活のバランスを最優先する" },
  { id: "work_life_remote", categoryId: "work_life", label: "リモート・柔軟勤務路線", guide: "場所や時間に柔軟な働き方を選ぶ", occupationHints: ["engineer", "freelance"] },
  { id: "work_life_part", categoryId: "work_life", label: "時間調整型キャリア路線", guide: "勤務時間・負荷を調整し続ける", occupationHints: ["part_time"] },
  { id: "work_life_local", categoryId: "work_life", label: "地域密着・定点キャリア路線", guide: "地域に根ざした安定キャリア" },
  { id: "work_life_sustainable", categoryId: "work_life", label: "持続可能なペース路線", guide: "長く続けられるペースで成果を出す" },
  { id: "work_life_family", categoryId: "work_life", label: "生活基盤優先のキャリア路線", guide: "家族・生活基盤を軸にキャリアを組む" },
  // creative (6)
  { id: "creative_planning", categoryId: "creative", label: "企画・プランニング路線", guide: "企画立案・戦略設計で価値を出す", occupationHints: ["marketing"] },
  { id: "creative_design", categoryId: "creative", label: "デザイン・表現活動路線", guide: "デザイン・ビジュアルで表現する", occupationHints: ["designer"] },
  { id: "creative_content", categoryId: "creative", label: "コンテンツ制作路線", guide: "記事・動画・コンテンツを生み出す", occupationHints: ["designer", "marketing"] },
  { id: "creative_brand", categoryId: "creative", label: "ブランディング路線", guide: "ブランド・世界観を構築する", occupationHints: ["marketing", "designer"] },
  { id: "creative_idea", categoryId: "creative", label: "アイデア発想・イノベーション路線", guide: "新しい発想で課題を解く" },
  { id: "creative_media", categoryId: "creative", label: "マーケ×クリエイティブ路線", guide: "マーケティングと創造性を融合", occupationHints: ["marketing"] },
  // social (6)
  { id: "social_welfare", categoryId: "social", label: "福祉・支援分野路線", guide: "福祉・支援で人を支える", occupationHints: ["medical", "service"] },
  { id: "social_education", categoryId: "social", label: "教育・人材育成路線", guide: "教育・育成で次世代に貢献", occupationHints: ["education"] },
  { id: "social_community", categoryId: "social", label: "地域・社会貢献路線", guide: "地域社会への貢献を軸にする" },
  { id: "social_healthcare", categoryId: "social", label: "医療・ヘルスケア路線", guide: "医療・健康分野で貢献する", occupationHints: ["medical"] },
  { id: "social_npo", categoryId: "social", label: "公共・NPO志向路線", guide: "公共性・社会課題解決を志向する" },
  { id: "social_sustainability", categoryId: "social", label: "サステナビリティ推進路線", guide: "持続可能性・ESGを推進する" },
  // ai_digital (6)
  { id: "ai_ml", categoryId: "ai_digital", label: "AI・機械学習エンジニア路線", guide: "AI/ML開発・研究に専念する", occupationHints: ["engineer"] },
  { id: "ai_data", categoryId: "ai_digital", label: "データ分析・サイエンス路線", guide: "データ分析で意思決定を支援", occupationHints: ["engineer", "consultant"] },
  { id: "ai_product", categoryId: "ai_digital", label: "AIプロダクト企画路線", guide: "AIプロダクトの企画・推進", occupationHints: ["engineer", "marketing"] },
  { id: "ai_dx", categoryId: "ai_digital", label: "AI活用DX推進路線", guide: "AIを使った業務・組織変革", occupationHints: ["engineer", "office_worker"] },
  { id: "ai_automation", categoryId: "ai_digital", label: "自動化・効率化特化路線", guide: "自動化で生産性を高める", occupationHints: ["engineer", "manufacturing"] },
  { id: "ai_digital_marketing", categoryId: "ai_digital", label: "デジタルマーケ×AI路線", guide: "AIを活用したマーケ・集客", occupationHints: ["marketing"] },
  // startup (6)
  { id: "startup_founder", categoryId: "startup", label: "起業・創業路線", guide: "自分で事業を立ち上げる", occupationHints: ["freelance", "manager"] },
  { id: "startup_venture", categoryId: "startup", label: "ベンチャー転職路線", guide: "ベンチャー企業で挑戦する" },
  { id: "startup_early", categoryId: "startup", label: "アーリーメンバー参画路線", guide: "初期メンバーとして成長に参画" },
  { id: "startup_intrapreneur", categoryId: "startup", label: "社内起業・新規事業路線", guide: "社内で新規事業を立ち上げる", occupationHints: ["manager", "engineer"] },
  { id: "startup_growth", categoryId: "startup", label: "急成長企業での挑戦路線", guide: "急成長環境でスキルを伸ばす" },
  { id: "startup_innovation", categoryId: "startup", label: "イノベーション推進路線", guide: "新規性・変革を組織で推進する" },
];

const patternMap = new Map(CAREER_PATH_PATTERNS.map((p) => [p.id, p]));
const categoryMap = new Map(CAREER_PATH_CATEGORIES.map((c) => [c.id, c]));

export function getCareerPathPattern(id: string): CareerPathPattern | undefined {
  return patternMap.get(id);
}

export function getCareerPathCategory(id: string): CareerPathCategory | undefined {
  return categoryMap.get(id);
}

export function isValidCareerPathPatternId(id: string): boolean {
  return patternMap.has(id);
}

export function getCareerPathPatternLabel(id: string): string {
  return getCareerPathPattern(id)?.label ?? "キャリアパス";
}

/** AI プロンプト用：カテゴリ別パターン一覧 */
export function formatCareerPathPatternsForPrompt(): string {
  return CAREER_PATH_CATEGORIES.map((category) => {
    const patterns = CAREER_PATH_PATTERNS.filter((p) => p.categoryId === category.id);
    const lines = patterns.map((p) => `  - ${p.id}: ${p.label}（${p.guide}）`).join("\n");
    return `【${category.label}】\n${lines}`;
  }).join("\n\n");
}
