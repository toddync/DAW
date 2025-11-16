// app/account/profile/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais. Estes dados serão usados para completar suas reservas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
