'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // Adiciona estado de loading
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Desabilita a necessidade de confirmação de e-mail para o ambiente de desenvolvimento
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // After a successful signup, the user is in the session.
    // Now, we call our API endpoint to create the user profile in the database.
    if (data.user) {
      setMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.')
    } else {
        setMessage("Verifique seu e-mail para confirmar a conta, caso já tenha se cadastrado.")
    }
    
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="underline hover:text-primary">
                  Entrar
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
