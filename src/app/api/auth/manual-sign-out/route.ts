import { NextResponse } from 'next/server'

export async function GET() {
  const response = new NextResponse(null, {
    status: 302,
    headers: {
      Location: '/api/auth/signin',
    },
  })

  // Expira os cookies manualmente
  response.cookies.set('next-auth.session-token', '', { maxAge: 0, path: '/' })
  response.cookies.set('next-auth.csrf-token', '', { maxAge: 0, path: '/' })
  response.cookies.set('next-auth.callback-url', '', { maxAge: 0, path: '/' })
  response.cookies.set('next-auth.user-image', '', { maxAge: 0, path: '/' })

  return response
}
