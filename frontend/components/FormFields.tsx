"use client";
import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type Common = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Render for dark surfaces (white text, light cobalt focus). */
  dark?: boolean;
};

function Wrapper({
  id,
  label,
  error,
  hint,
  dark,
  required,
  children,
}: Common & { required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={dark ? "field-label-dark" : "field-label"}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={`mt-2 text-sm ${dark ? "text-white/65" : "text-black/60"}`}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4.2M8 11v.01" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export const TextField = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { id, label, error, hint, dark, ...props },
  ref
) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} dark={dark} required={props.required}>
      <input
        ref={ref}
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={dark ? "field-input-dark" : "field-input"}
        {...props}
        // Validation is handled in React so messages are consistent and accessible.
        required={false}
        aria-required={props.required || undefined}
      />
    </Wrapper>
  );
});

export function SelectField({
  id,
  label,
  error,
  hint,
  dark,
  children,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} dark={dark} required={props.required}>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={dark ? "field-input-dark" : "field-input"}
        {...props}
        required={false}
        aria-required={props.required || undefined}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  dark,
  ...props
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} dark={dark} required={props.required}>
      <textarea
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${dark ? "field-input-dark" : "field-input"} min-h-[110px] resize-y`}
        {...props}
        required={false}
        aria-required={props.required || undefined}
      />
    </Wrapper>
  );
}
