/** 日本語テキスト：句読点の孤立や不自然な改行を抑える */
export const jpTextSx = {
  wordBreak: "normal",
  overflowWrap: "break-word",
  lineBreak: "strict",
  textWrap: "pretty",
} as const;

/** フレックス内で折り返しが効くようにする */
export const jpBodyTextSx = {
  ...jpTextSx,
  minWidth: 0,
  flex: 1,
} as const;

export const jpBulletRowSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 0.75,
  minWidth: 0,
} as const;

export const jpBulletMarkerSx = {
  flexShrink: 0,
  userSelect: "none",
} as const;
