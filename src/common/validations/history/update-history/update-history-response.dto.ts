import type { z } from "zod"
import { historySchema, historyStringDatesSchema } from "../history.dto"

export const updateHistoryResponseSchema = historySchema
export type UpdateHistoryResponseDto = z.infer<typeof updateHistoryResponseSchema>

export const updateHistoryStringDatesResponseSchema = historyStringDatesSchema
export type UpdateHistoryStringDatesResponseDto = z.infer<typeof updateHistoryStringDatesResponseSchema>

