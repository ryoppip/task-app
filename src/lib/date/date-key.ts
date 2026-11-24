/** Asia/Tokyo の暦日を表す `YYYY-MM-DD` 文字列 */
export type DateKey = string;

/** 0 = 日曜 〜 6 = 土曜 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const APP_TIME_ZONE = "Asia/Tokyo";

const DAY_MS = 24 * 60 * 60 * 1000;

const tokyoFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 端末のタイムゾーンに関係なく、その瞬間の東京の日付を返す */
export function toDateKey(instant: Date): DateKey {
  const parts = tokyoFormatter.formatToParts(instant);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

/** 日付キーの計算は、時差の影響を受けないよう UTC の0時に置き換えて行う */
function toUtcMs(key: DateKey): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    throw new RangeError(`不正な日付です: ${key}`);
  }
  const ms = Date.parse(`${key}T00:00:00.000Z`);
  if (Number.isNaN(ms) || fromUtcMs(ms) !== key) {
    throw new RangeError(`存在しない日付です: ${key}`);
  }
  return ms;
}

function fromUtcMs(ms: number): DateKey {
  return new Date(ms).toISOString().slice(0, 10);
}

export function isDateKey(value: string): boolean {
  try {
    toUtcMs(value);
    return true;
  } catch {
    return false;
  }
}

export function addDays(key: DateKey, days: number): DateKey {
  return fromUtcMs(toUtcMs(key) + days * DAY_MS);
}

/** `to - from` の日数。同じ日なら 0 */
export function diffDays(from: DateKey, to: DateKey): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

export function getWeekday(key: DateKey): Weekday {
  return new Date(toUtcMs(key)).getUTCDay() as Weekday;
}

/** 月曜始まりの週の初日 */
export function startOfWeek(key: DateKey): DateKey {
  return addDays(key, -((getWeekday(key) + 6) % 7));
}

/** `from` から `to` まで(両端を含む)の日付キー */
export function eachDay(from: DateKey, to: DateKey): DateKey[] {
  const length = Math.max(0, diffDays(from, to) + 1);
  return Array.from({ length }, (_, index) => addDays(from, index));
}
