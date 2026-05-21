'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

import { registerSchema, type RegisterFormData } from '@/features/auth/schemas'

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      registration: '',
      sector: '',
      position: '',
      phone: '',
      role: 'member',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)

    if (!acceptedTerms) {
      setServerError('Você precisa aceitar os termos para continuar.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            full_name: data.full_name,
            registration: data.registration,
            sector: data.sector,
            position: data.position,
            phone: data.phone?.trim() ? data.phone : null,
            role: data.role,
          }),
        }
      )

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        if (Array.isArray(result?.detail)) {
          const firstError = result.detail[0]
          setServerError(firstError?.msg || 'Dados inválidos. Verifique os campos.')
          return
        }

        setServerError(
          result?.message ||
            result?.detail ||
            'Não foi possível criar sua conta.'
        )
        return
      }

      router.push('/login?registered=true')
    } catch {
      setServerError('Ocorreu um erro inesperado ao criar sua conta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
          Criar conta
        </p>
        <h2 className="text-3xl font-black leading-tight text-gray-900">
          Cadastre seu usuário.
        </h2>
        <p className="text-sm text-gray-500">
          Preencha os dados solicitados para solicitar acesso ao sistema.
        </p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            placeholder="Seu nome completo"
            disabled={isLoading}
            aria-invalid={!!errors.full_name}
            {...register('full_name')}
          />
          {errors.full_name && (
            <p className="text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seuemail@empresa.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="registration">Matrícula</Label>
            <Input
              id="registration"
              placeholder="Ex: 12345"
              disabled={isLoading}
              aria-invalid={!!errors.registration}
              {...register('registration')}
            />
            {errors.registration && (
              <p className="text-sm text-red-600">
                {errors.registration.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(81) 99999-9999"
              disabled={isLoading}
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Input
              id="sector"
              placeholder="Ex: Operações"
              disabled={isLoading}
              aria-invalid={!!errors.sector}
              {...register('sector')}
            />
            {errors.sector && (
              <p className="text-sm text-red-600">{errors.sector.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input
              id="position"
              placeholder="Ex: Analista"
              disabled={isLoading}
              aria-invalid={!!errors.position}
              {...register('position')}
            />
            {errors.position && (
              <p className="text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Crie uma senha"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 transition-colors hover:text-gray-700"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repita sua senha"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 transition-colors hover:text-gray-700"
              aria-label={
                showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
              }
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-md border border-gray-200 p-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          />
          <label
            htmlFor="terms"
            className="cursor-pointer text-sm leading-5 text-gray-600"
          >
            Eu aceito os{' '}
            <Link href="#" className="font-medium text-red-600 hover:text-red-700">
              termos de uso
            </Link>{' '}
            e a{' '}
            <Link href="#" className="font-medium text-red-600 hover:text-red-700">
              política de privacidade
            </Link>
            .
          </label>
        </div>

        <Button
          type="submit"
          className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs uppercase tracking-wider text-gray-400">
          ou
        </span>
      </div>

      <p className="text-center text-sm text-gray-500">
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-red-600 transition-colors hover:text-red-700"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}