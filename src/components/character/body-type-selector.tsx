import { BODY_TYPES, type BodyType } from "@/lib/character/characters";

interface BodyTypeSelectorProps {
  value: BodyType;
  disabled: boolean;
  onChange: (value: BodyType) => void;
}

export function BodyTypeSelector({
  value,
  disabled,
  onChange,
}: BodyTypeSelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="font-semibold">スタートの体型</legend>
      <p className="mt-1 text-sm text-muted">
        どちらから始めても、90日でゴリマッチョになります。
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {BODY_TYPES.map(({ id, name }) => (
          <label
            key={id}
            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-control border px-4 py-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-strong ${
              value === id
                ? "border-primary bg-secondary font-semibold"
                : "border-line"
            }`}
          >
            <input
              type="radio"
              name="bodyType"
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="size-4 accent-primary-strong"
            />
            {name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
