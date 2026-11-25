"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGrowthSummary } from "@/hooks/use-growth-summary";
import { useProfile } from "@/hooks/use-profile";
import {
  CHARACTERS,
  DEFAULT_BODY_TYPE,
  type BodyType,
  type CharacterId,
} from "@/lib/character/characters";
import { toErrorMessage } from "@/lib/repositories/errors";
import { BodyTypeSelector } from "./body-type-selector";
import { GrowthStageList } from "./growth-stage-list";

export function CharacterPicker() {
  const { profile, error, updateProfile } = useProfile();
  const { summary } = useGrowthSummary();
  const [saveError, setSaveError] = useState<string | null>(null);
  const bodyType = profile?.bodyType ?? DEFAULT_BODY_TYPE;

  async function save(patch: {
    characterId?: CharacterId;
    bodyType?: BodyType;
  }) {
    setSaveError(null);
    try {
      await updateProfile(patch);
    } catch (cause) {
      setSaveError(toErrorMessage(cause));
    }
  }

  const message = saveError ?? (error ? toErrorMessage(error) : null);

  return (
    <div className="space-y-5">
      {message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
      <Card>
        <BodyTypeSelector
          value={bodyType}
          disabled={!profile}
          onChange={(value) => save({ bodyType: value })}
        />
      </Card>
      {CHARACTERS.map(({ id, name, description }) => {
        const isSelected = profile?.characterId === id;
        return (
          <Card key={id} className={isSelected ? "border-primary" : ""}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{name}</h2>
                <p className="text-sm text-muted">{description}</p>
              </div>
              {isSelected ? (
                <p className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary-strong">
                  <Check aria-hidden className="size-4" />
                  選択中
                </p>
              ) : (
                <Button
                  variant="secondary"
                  disabled={!profile}
                  aria-label={`${name}にする`}
                  onClick={() => save({ characterId: id })}
                >
                  この子にする
                </Button>
              )}
            </div>
            <GrowthStageList
              characterId={id}
              bodyType={bodyType}
              currentStage={
                isSelected ? (summary?.growth.current.stage ?? null) : null
              }
            />
          </Card>
        );
      })}
    </div>
  );
}
