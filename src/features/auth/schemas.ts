import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Informe um e-mail válido'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'O e-mail é obrigatório')
      .email('Informe um e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .max(64, 'A senha deve ter no máximo 64 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    full_name: z
      .string()
      .min(2, 'O nome deve ter no mínimo 2 caracteres')
      .max(255, 'O nome deve ter no máximo 255 caracteres'),
    registration: z
      .string()
      .min(3, 'A matrícula deve ter no mínimo 3 caracteres')
      .max(50, 'A matrícula deve ter no máximo 50 caracteres'),
    sector: z
      .string()
      .min(2, 'O setor deve ter no mínimo 2 caracteres')
      .max(100, 'O setor deve ter no máximo 100 caracteres'),
    position: z
      .string()
      .min(2, 'O cargo deve ter no mínimo 2 caracteres')
      .max(100, 'O cargo deve ter no máximo 100 caracteres'),
    phone: z
      .string()
      .max(30, 'Telefone inválido')
      .optional()
      .or(z.literal('')),
    role: z.enum(['admin', 'gestor', 'servidor']).default('servidor'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>