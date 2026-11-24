export const DISPLAY_NAME_MAX_LENGTH = 30;

/** 問題があれば表示用のメッセージ、なければ null */
export function validateDisplayName(value: string): string | null {
  const length = [...value.trim()].length;
  if (length === 0) return "表示名を入力してください。";
  if (length > DISPLAY_NAME_MAX_LENGTH) {
    return `表示名は${DISPLAY_NAME_MAX_LENGTH}文字以内で入力してください。`;
  }
  return null;
}
