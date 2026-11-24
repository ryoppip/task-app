"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { validateDisplayName } from "@/lib/domain/profile";
import type { Profile } from "@/lib/domain/types";
import { toErrorMessage } from "@/lib/repositories/errors";

interface ProfileFormProps {
  profile: Profile;
  onSave: (patch: { displayName: string }) => Promise<void>;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  // 編集していない間は保存値をそのまま表示し、別タブでの変更にも追従する
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const displayName = draft ?? profile.displayName;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateDisplayName(displayName);
    setError(validationError);
    if (validationError) return;

    setIsSaving(true);
    try {
      await onSave({ displayName: displayName.trim() });
      setDraft(null);
      setIsSaved(true);
    } catch (cause) {
      setError(toErrorMessage(cause));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      <TextField
        label="表示名"
        name="displayName"
        autoComplete="nickname"
        value={displayName}
        error={error}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
          setIsSaved(false);
        }}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          保存
        </Button>
        <p role="status" className="text-sm text-primary-strong">
          {isSaved && "保存しました"}
        </p>
      </div>
    </form>
  );
}
