import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const RESEND_COOKIE_NAME = "otp_next_allowed_at";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(RESEND_COOKIE_NAME)?.value;
  const value = raw ? Number(raw) : null;
  if (!value || Number.isNaN(value)) {
    return NextResponse.json({ nextAllowedAt: null });
  }
  return NextResponse.json({ nextAllowedAt: value });
}

