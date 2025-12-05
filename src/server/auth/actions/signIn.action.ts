"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_COOKIE_NAME = "otp_next_allowed_at";

export async function signIn(email: string, context: "saas" | "tenant") {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    return { error: error, message: "Failed to sign in" };
  }

  const now = Date.now();
  const nextAllowedAt = now + RESEND_COOLDOWN_SECONDS * 1000;
  const cookieStore = await cookies();
  cookieStore.set(RESEND_COOKIE_NAME, String(nextAllowedAt), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: RESEND_COOLDOWN_SECONDS,
  });

  return {
    error: false,
    message: "Sign in successful",
    data,
    nextAllowedAt,
  };
}

export async function getOtpNextAllowedAt() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(RESEND_COOKIE_NAME)?.value;
  const value = raw ? Number(raw) : null;
  if (!value || Number.isNaN(value)) return { nextAllowedAt: null };
  return { nextAllowedAt: value };
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: token.trim(),
    type: "email",
  });

  if (error) {
    return { error: true, message: "Failed to verify OTP" };
  }

  return { error: false, message: "OTP verified successfully" };
}
