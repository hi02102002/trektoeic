import z from "zod";

export const HistoryActionSchema = z.enum(["practice_part", "mock_test"]);

export type HistoryAction = z.infer<typeof HistoryActionSchema>;
