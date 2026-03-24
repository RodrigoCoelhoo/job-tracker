import { z } from "zod";

export const interviewFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	date: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	note: z.string().optional(),
});

export type InterviewForm = z.infer<typeof interviewFormSchema>;