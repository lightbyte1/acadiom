import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_COOKIE_NAME = "otp_next_allowed_at";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json(
        { error: true, message: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    console.log(await supabase.auth.getUser());

    if (error) {
      return NextResponse.json(
        { error: true, message: "Failed to send OTP" },
        { status: 400 }
      );
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

    return NextResponse.json({ error: false, nextAllowedAt });
  } catch (e) {
    return NextResponse.json(
      { error: true, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
