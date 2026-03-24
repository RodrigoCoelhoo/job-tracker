import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type Target = 'body' | 'query' | 'params';

export function validateInput(schema: z.ZodType, target: Target = 'body') {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[target]);

		if (!result.success) {
			res.status(400).json({
				error: 'Validation failed',
				details: z.flattenError(result.error).fieldErrors,
			});
			return;
		}

		Object.assign(req[target], result.data);
		next();
	};
}