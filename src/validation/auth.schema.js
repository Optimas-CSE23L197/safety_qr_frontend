/**
 * AUTH SCHEMAS (Zod)
 * Client-side validation — mirrors backend auth.validation.js.
 * Used by: useAdminLogin, useSchoolLogin, and any future auth forms.
 */

import { z } from "zod";

// ─── Email + Password ─────────────────────────────────────────────────────────
// Shared by Super Admin login AND School User login

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export const loginDefaults = {
  email: "",
  password: "",
};

// ─── Send OTP (Parent login step 1) ──────────────────────────────────────────

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+91[6-9]\d{9}$/,
      "Enter a valid Indian mobile number (+91XXXXXXXXXX)",
    ),
});

export const sendOtpDefaults = {
  phone: "",
};

// ─── Verify OTP (Parent login step 2) ────────────────────────────────────────

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+91[6-9]\d{9}$/, "Enter a valid Indian mobile number"),

  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const verifyOtpDefaults = {
  phone: "",
  otp: "",
};

// ─── Register Init (Parent registration step 1) ───────────────────────────────

export const registerInitSchema = z.object({
  card_number: z
    .string()
    .min(1, "Card number is required")
    .length(16, "Card number must be 16 characters")
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9-]/g, "")),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+91[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
});

export const registerInitDefaults = {
  card_number: "",
  phone: "",
};

// ─── Register Verify (Parent registration step 2) ────────────────────────────

export const registerVerifySchema = z.object({
  nonce: z.string().min(10, "Invalid registration session"),
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+91[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
});

export const registerVerifyDefaults = {
  nonce: "",
  otp: "",
  phone: "",
};
