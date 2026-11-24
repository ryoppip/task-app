import { describe, expect, it } from "vitest";
import { validateDisplayName } from "./profile";

describe("validateDisplayName", () => {
  it("空白だけの名前を拒否する", () => {
    expect(validateDisplayName("  ")).not.toBeNull();
  });

  it("30文字まで許可する(絵文字は1文字として数える)", () => {
    expect(validateDisplayName("あ".repeat(30))).toBeNull();
    expect(validateDisplayName("💪".repeat(30))).toBeNull();
    expect(validateDisplayName("あ".repeat(31))).not.toBeNull();
  });
});
