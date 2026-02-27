/**
 * TOKEN VALIDATION SCHEMAS (Zod)
 */

import { z } from "zod";

export const createTokenBatchSchema = z.object({
  count: z
    .number()
    .int("Must be a whole number")
    .min(1, "Must create at least 1 token")
    .max(1000, "Cannot create more than 1000 tokens at once"),
  notes: z.string().max(255, "Notes too long").optional().or(z.literal("")),
});

export const assignTokenSchema = z.object({
  student_id: z
    .string()
    .uuid("Invalid student ID")
    .min(1, "Student is required"),
  token_id: z.string().uuid("Invalid token ID").min(1, "Token is required"),
});

export const revokeTokenSchema = z.object({
  reason: z
    .string()
    .min(5, "Please provide a reason (min 5 characters)")
    .max(255, "Reason too long")
    .trim(),
});

export const rejectRequestSchema = z.object({
  reject_reason: z
    .string()
    .min(5, "Please provide a reason (min 5 characters)")
    .max(500, "Reason too long")
    .trim(),
});
