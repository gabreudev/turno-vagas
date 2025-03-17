import { z } from "zod"
import { weekDaySchema } from "../shift/shift.dto"

export const historySchema = z.object({
  id: z.number(),
  weekDay: weekDaySchema,
  startAt: z.number().int().min(0),
  endAt: z.number().int().min(0),
  isPresent: z.boolean(),
  relatedDate: z.date(),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type HistoryDto = z.infer<typeof historySchema>

export const historyStringDatesSchema = historySchema.extend({
  relatedDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type HistoryStringDatesDto = z.infer<typeof historyStringDatesSchema>

export const updateHistorySchema = z.object({
  isPresent: z.boolean(),
})

export type UpdateHistoryDto = z.infer<typeof updateHistorySchema>

export const updateHistoryResponseSchema = historySchema
export type UpdateHistoryResponseDto = z.infer<typeof updateHistoryResponseSchema>

export const updateHistoryStringDatesResponseSchema = historyStringDatesSchema
export type UpdateHistoryStringDatesResponseDto = z.infer<typeof updateHistoryStringDatesResponseSchema>

