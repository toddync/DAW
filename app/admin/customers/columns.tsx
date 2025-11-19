"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Usuario } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const getColumns = (
    onEdit: (usuario: Usuario) => void
): ColumnDef<Usuario>[] => [
        {
            accessorKey: "nome",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Função",
            cell: ({ row }) => {
                const role = row.getValue("role") as string
                return <Badge variant="outline">{role}</Badge>
            }
        },
        {
            accessorKey: "telefone",
            header: "Telefone",
            cell: ({ row }) => row.getValue("telefone") || "N/A"
        },
        {
            accessorKey: "data_cadastro",
            header: "Data Cadastro",
            cell: ({ row }) => {
                const date = new Date(row.getValue("data_cadastro"))
                return format(date, "dd/MM/yyyy")
            }
        },
        {
            accessorKey: "ativo",
            header: "Status",
            cell: ({ row }) => {
                const ativo = row.getValue("ativo") as boolean
                return (
                    <Badge variant={ativo ? "default" : "destructive"}>
                        {ativo ? "Ativo" : "Inativo"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const usuario = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(usuario.id)}>
                                Copiar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(usuario)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
