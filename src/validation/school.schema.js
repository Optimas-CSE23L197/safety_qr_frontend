/**
 * SCHOOL VALIDATION SCHEMAS (Zod)
 */

import { z } from "zod";

export const registerSchoolSchema = z.object({
  name: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be under 100 characters")
    .trim(),
  code: z
    .string()
    .min(2, "School code must be at least 2 characters")
    .max(20, "School code must be under 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code must be uppercase letters, numbers, hyphens or underscores",
    )
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{10,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().max(255, "Address too long").optional(),
  city: z.string().max(100, "City too long").optional(),
  country: z.string().default("IN"),
  timezone: z.string().default("Asia/Kolkata"),
});

export const updateSchoolSchema = registerSchoolSchema
  .partial()
  .omit({ code: true });

export const schoolSettingsSchema = z.object({
  allow_location: z.boolean(),
  allow_parent_edit: z.boolean(),
  scan_notifications_enabled: z.boolean(),
  notify_on_every_scan: z.boolean(),
  scan_alert_cooldown_mins: z
    .number()
    .int()
    .min(1, "Must be at least 1 minute")
    .max(1440, "Cannot exceed 24 hours (1440 minutes)"),
  token_validity_months: z
    .number()
    .int()
    .min(1, "Must be at least 1 month")
    .max(60, "Cannot exceed 60 months"),
  max_tokens_per_student: z
    .number()
    .int()
    .min(1, "Must be at least 1")
    .max(5, "Cannot exceed 5 tokens per student"),
  default_profile_visibility: z.enum(["PUBLIC", "MINIMAL", "HIDDEN"]),
});

export const trustedZoneSchema = z.object({
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(100, "Label too long")
    .trim(),
  ip_range: z
    .string()
    .regex(
      /^(\d{1,3}\.){1,3}\d{0,3}$/,
      "Enter a valid IP range prefix (e.g. 103.21.58.)",
    )
    .optional()
    .or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  radius_m: z
    .number()
    .int()
    .min(50, "Minimum radius is 50 metres")
    .max(10000, "Maximum radius is 10,000 metres")
    .default(200),
});
