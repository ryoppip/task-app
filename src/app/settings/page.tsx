import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileSection } from "@/components/settings/profile-section";

export const metadata: Metadata = { title: "設定" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="設定" />
      <ProfileSection />
    </>
  );
}
