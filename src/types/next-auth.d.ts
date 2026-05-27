import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    accessToken:         string
    refreshToken:        string
    rememberMe?:         boolean
    accessTokenExpires?: number
  }

  interface Session {
    accessToken:  string
    refreshToken: string
    error?:       string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken:         string
    refreshToken:        string
    accessTokenExpires?: number
    rememberMe?:         boolean
    error?:              string
  }
}