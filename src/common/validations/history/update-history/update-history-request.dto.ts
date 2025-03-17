import type { z } from "zod"
import { historySchema } from "../history.dto"

export const updateHistoryRequestSchema = historySchema.partial().pick({
  isPresent: true,
})

export type UpdateHistoryRequestDto = z.infer<typeof updateHistoryRequestSchema>

