"use client";

const inputCls =
  "mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-sans text-sm text-ink">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
        {!required ? <span className="text-ink-soft"> (optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 font-sans text-sm text-accent">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 font-sans text-xs text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  required,
  type = "text",
  maxLength,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function TextArea({
  id,
  value,
  onChange,
  rows = 6,
  serif,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  serif?: boolean;
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-y ${serif ? "font-serif leading-relaxed" : ""}`}
    />
  );
}
