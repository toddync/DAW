import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { HomeIcon, UsersIcon, CreditCardIcon, BedIcon, BuildingIcon, CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin">
            <SidebarMenuButton>
              <HomeIcon className="h-6 w-6" />
              <span className="ml-2">Início Admin</span>
            </SidebarMenuButton>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin/customers">
                <SidebarMenuButton>
                  <UsersIcon className="h-5 w-5" />
                  Clientes
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/payments">
                <SidebarMenuButton>
                  <CreditCardIcon className="h-5 w-5" />
                  Pagamentos
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/vacancy">
                <SidebarMenuButton>
                  <CalendarIcon className="h-5 w-5" />
                  Vagas
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/rooms">
                <SidebarMenuButton>
                  <BuildingIcon className="h-5 w-5" />
                  Quartos
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/beds">
                <SidebarMenuButton>
                  <BedIcon className="h-5 w-5" />
                  Camas
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/packages">
                <SidebarMenuButton>
                  <PackageIcon className="h-5 w-5" />
                  Pacotes
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4">{children}</main>
    </SidebarProvider>
  );
}
