import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel de Administração</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Bem-vindo ao painel de administração. Por favor, selecione uma seção na barra lateral para começar.</p>
      </CardContent>
    </Card>
  );
}
