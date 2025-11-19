"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vaga } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export const getColumns = (
    onEdit: (vaga: Vaga) => void,
    onDelete: (vaga: Vaga) => void
): ColumnDef<Vaga>[] => [
        {
            accessorKey: "numero_vaga",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Número
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "quartos.numero",
            header: "Quarto",
            cell: ({ row }) => {
                const quarto = row.original.quartos;
                return quarto ? quarto.numero : 'N/A';
            }
        },
        {
            accessorKey: "tipo_cama",
            header: "Tipo",
            cell: ({ row }) => {
                const tipo = row.getValue("tipo_cama") as string;
                return <span className="capitalize">{tipo}</span>
            }
        },
        {
            accessorKey: "posicao",
            header: "Posição",
            cell: ({ row }) => {
                const posicao = row.getValue("posicao") as string;
                return <span className="capitalize">{posicao}</span>
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "disponivel" ? "default" : status === "ocupada" ? "secondary" : "destructive"}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const vaga = row.original

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(vaga.id)}>
                                Copiar ID da Vaga
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(vaga)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(vaga)} className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Deletar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
