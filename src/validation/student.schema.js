/**
 * STUDENT VALIDATION SCHEMAS (Zod)
 */

import { z } from "zod";

export const createStudentSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .trim(),
  last_name: z
    .string()
    .max(50, "Last name too long")
    .optional()
    .or(z.literal("")),
  class: z.string().max(20, "Class too long").optional().or(z.literal("")),
  section: z.string().max(10, "Section too long").optional().or(z.literal("")),
  dob: z.string().optional(), // date string YYYY-MM-DD
  photo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateStudentSchema = createStudentSchema.partial();

export const emergencyProfileSchema = z.object({
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"])
    .optional()
    .nullable(),
  allergies: z.string().max(500, "Too long").optional().nullable(),
  conditions: z.string().max(500, "Too long").optional().nullable(),
  medications: z.string().max(500, "Too long").optional().nullable(),
  doctor_name: z.string().max(100, "Too long").optional().nullable(),
  doctor_phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{10,15}$/, "Invalid phone number")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z.string().max(1000, "Notes too long").optional().nullable(),
  visibility: z.enum(["PUBLIC", "MINIMAL", "HIDDEN"]).default("PUBLIC"),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Too long").trim(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[+]?[0-9\s-]{10,15}$/, "Enter a valid phone number"),
  relationship: z.string().max(50, "Too long").optional().or(z.literal("")),
  priority: z.number().int().min(1).max(10),
});
