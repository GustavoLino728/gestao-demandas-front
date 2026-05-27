import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authService } from '@/services/auth.service'

const ACCESS_TOKEN_LIFETIME  = 30 * 60
const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60

const REFRESH_MARGIN_MS = 60 * 1000

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:      { label: 'Email',          type: 'email'    },
        password:   { label: 'Senha',          type: 'password' },
        rememberMe: { label: 'Lembrar de mim', type: 'text'     },
      },

      async authorize(credentials) {
        try {
          const data = await authService.login({
            email:    credentials.email    as string,
            password: credentials.password as string,
          })

          return {
            id:                  'authenticated',
            accessToken:         data.access_token,
            refreshToken:        data.refresh_token,
            rememberMe:          credentials.rememberMe === 'true',
            accessTokenExpires:  Date.now() + ACCESS_TOKEN_LIFETIME * 1000,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: REFRESH_TOKEN_LIFETIME,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken        = user.accessToken
        token.refreshToken       = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires as number
        token.rememberMe         = user.rememberMe as boolean
        return token
      }

      const accessTokenExpires = token.accessTokenExpires as number
      if (Date.now() < accessTokenExpires - REFRESH_MARGIN_MS) {
        return token
      }

      try {
        const refreshed = await authService.refresh({
          refresh_token: token.refreshToken as string,
        })

        return {
          ...token,
          accessToken:        refreshed.access_token,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME * 1000,
          error:              undefined,
        }
      } catch {
        return {
          ...token,
          error: 'RefreshTokenError' as const,
        }
      }
    },

    async session({ session, token }) {
      session.accessToken  = token.accessToken  as string
      session.refreshToken = token.refreshToken as string

      if (token.error) {
        session.error = token.error as string
      }

      return session
    },
  },

  pages: {
    signIn: '/login',
  },
})