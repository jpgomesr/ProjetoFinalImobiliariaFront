import { z } from "zod";

export interface ModelCorretor {
   id: number;
   nome: string;
}

export const ModelCorretorSchema = z.object({
   id: z.number(),
   nome: z.string(),
});
