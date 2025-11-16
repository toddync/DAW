// app/account/onboarding/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form' 

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/account/onboarding')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleOnboardingComplete = () => {
    // Redireciona para a página principal após a conclusão
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo! Complete seu Perfil</CardTitle>
          <CardDescription>
            Precisamos de mais algumas informações para finalizar a criação da sua conta.
            Estes dados são essenciais para as suas reservas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm onSuccess={handleOnboardingComplete} />
        </CardContent>
      </Card>
    </div>
  )
}
