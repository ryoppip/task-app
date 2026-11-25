import type { Metadata } from "next";
import { CharacterPicker } from "@/components/character/character-picker";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "キャラクター" };

export default function CharactersPage() {
  return (
    <>
      <PageHeader
        title="キャラクター"
        description="一緒に成長する仲間を選びます。変えても、これまでの記録は変わりません。"
      />
      <CharacterPicker />
    </>
  );
}
