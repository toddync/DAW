import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, CreditCardIcon, BedIcon, BuildingIcon, CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";

const adminSections = [
  {
    title: "Clientes",
    description: "Gerenciar usuários e clientes.",
    icon: UsersIcon,
    href: "/admin/customers",
    color: "text-blue-500",
  },
  {
    title: "Pagamentos",
    description: "Visualizar e atualizar pagamentos.",
    icon: CreditCardIcon,
    href: "/admin/payments",
    color: "text-green-500",
  },
  {
    title: "Vagas",
    description: "Controle de ocupação e disponibilidade.",
    icon: CalendarIcon,
    href: "/admin/vacancy",
    color: "text-purple-500",
  },
  {
    title: "Quartos",
    description: "Gerenciar quartos e capacidades.",
    icon: BuildingIcon,
    href: "/admin/rooms",
    color: "text-orange-500",
  },
  {
    title: "Camas",
    description: "Gerenciar camas individuais.",
    icon: BedIcon,
    href: "/admin/beds",
    color: "text-indigo-500",
  },
  {
    title: "Pacotes",
    description: "Configurar pacotes e promoções.",
    icon: PackageIcon,
    href: "/admin/packages",
    color: "text-pink-500",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {section.title}
                </CardTitle>
                <section.icon className={`h-4 w-4 ${section.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
