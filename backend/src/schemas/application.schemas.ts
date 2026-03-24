import { z } from "zod";

export const StatusSchema = z.enum(['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']);
export const TypeSchema = z.enum(['Full-time', 'Internship', 'Contract', 'Part-time']);

export const ApplicationFormSchema = z.object({
	company: z.string().min(1, "Company is required").max(100).trim(),
	location: z.string().max(100).trim().optional().default(""),
	role: z.string().min(1, "Role is required").max(100).trim(),
	type: TypeSchema,
	date: z.coerce.date(),
	status: StatusSchema.default('Applied'),
	notes: z.string().max(1000).trim().optional().default(""),
});

export const GetApplicationsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: StatusSchema.optional(),
});

export type ApplicationForm = z.infer<typeof ApplicationFormSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Type = z.infer<typeof TypeSchema>;