import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export function useOtpSchema() {
  return otpSchema;
}
