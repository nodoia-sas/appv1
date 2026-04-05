import { z } from 'zod'

/**
 * Valida los datos contra un esquema Zod.
 * Si falla, responde 400 y retorna null.
 * Si pasa, retorna los datos parseados.
 *
 * @template T
 * @param {import('next').NextApiResponse} res
 * @param {z.ZodSchema<T>} schema
 * @param {unknown} data
 * @returns {T | null}
 */
export function validate(res, schema, data) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    res.status(400).json({ error: 'Invalid parameters', details: errors })
    return null
  }
  return result.data
}

// ── Esquemas reutilizables ────────────────────────────────────────────────────

export const listQuerySchema = z.object({
  pageNumber: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(['createdAt', 'updatedAt', 'name', 'id']).default('createdAt'),
  sort: z.enum(['ASC', 'DESC']).default('DESC'),
})

export const idParamSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .max(128)
    .regex(/^[\w\-]+$/, 'ID contains invalid characters'),
})
