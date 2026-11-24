"use client";

import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { toErrorMessage } from "@/lib/repositories/errors";
import { ProfileForm } from "./profile-form";

export function ProfileSection() {
  const { profile, error, updateProfile } = useProfile();

  return (
    <Card title="プロフィール">
      {profile ? (
        <ProfileForm profile={profile} onSave={updateProfile} />
      ) : error ? (
        <p role="alert" className="text-sm text-danger">
          {toErrorMessage(error)}
        </p>
      ) : (
        <p className="text-sm text-muted">読み込み中…</p>
      )}
    </Card>
  );
}
