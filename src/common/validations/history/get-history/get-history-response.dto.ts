import { z } from "zod"
import { historySchema, historyStringDatesSchema } from "../history.dto"

export const getHistoryResponseSchema = z.array(historySchema)

export type GetHistoryResponseDto = z.infer<typeof getHistoryResponseSchema>

export const getHistoryStringDatesResponseSchema = z.array(historyStringDatesSchema)

export type GetHistoryStringDatesResponseDto = z.infer<typeof getHistoryStringDatesResponseSchema>

