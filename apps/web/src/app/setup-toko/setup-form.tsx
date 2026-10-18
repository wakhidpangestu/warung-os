"use client";

import { useActionState } from "react";
import { setupShop, type SetupState } from "./actions";
const initialState: SetupState = {};

export function SetupForm() {
  const [state, action, pending] = useActionState(setupShop, initialState);
  return (
    <form action={action} className="form-card">
      <label className="field">
        <span className="field-label">Nama toko</span>
        <input
          className="text-input"
          autoFocus
          name="name"
          placeholder="Contoh: Warung Sumber Rejeki"
          required
          minLength={2}
          maxLength={120}
        />
        <span className="field-hint">Gunakan 2 sampai 120 karakter.</span>
      </label>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Menyiapkan toko..." : "Buat toko"}
      </button>
      <p className="form-note">Pengaturan ini dapat dilengkapi pada tahap berikutnya.</p>
    </form>
  );
}
