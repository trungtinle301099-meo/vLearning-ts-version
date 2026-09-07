import { z } from 'zod';

export const errorResponseSchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  content: z.unknown().optional(),
  dateTime: z.string().optional()
});

export const stringSuccessResponseSchema = z.string();

export const paginationQuerySchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive()
});
