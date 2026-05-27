'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

import { loginSchema, type LoginFormData } from '@/features/auth/schemas'

export default function LoginPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const justRegistered = searchParams.get('registered') === 'true'
  const callbackUrl = searchParams.get('callbackUrl') || '/boards'
  const sessionError = searchParams.get('error')

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
          email:      data.email,
          password:   data.password,
          rememberMe: String(rememberMe),
          redirect:   false,
        })

      if (!result) {
        setServerError('Não foi possível iniciar a autenticação.')
        return
      }

      if (result.error) {
        setServerError('E-mail ou senha inválidos. Verifique suas credenciais.')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setServerError('Ocorreu um erro inesperado ao tentar entrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
          Acesso ao sistema
        </p>
        <h2 className="text-3xl font-black leading-tight text-gray-900">
          Bem-vindo de volta.
        </h2>
        <p className="text-sm text-gray-500">
          Entre com suas credenciais para acessar sua área de trabalho.
        </p>
      </div>

      {justRegistered && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription className="text-sm">
            Conta criada com sucesso! Faça login para continuar.
          </AlertDescription>
        </Alert>
      )}

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {sessionError === 'SessionExpired' && (
        <Alert variant="destructive">
          <AlertDescription>
            Sua sessão expirou. Por favor, faça login novamente.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            E-mail institucional
          </Label>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Senha
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              autoComplete="current-password"
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

        <div className="flex items-center justify-between">
          <label
            htmlFor="remember-me"
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
          >
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            Lembrar de mim
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
              Entrando...
            </>
          ) : (
            'Entrar'
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
        Ainda não tem conta?{' '}
        <Link
          href="/register"
          className="font-semibold text-red-600 transition-colors hover:text-red-700"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}