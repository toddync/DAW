"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pagamento } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react"
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
    onUpdateStatus: (pagamento: Pagamento, status: string) => void
): ColumnDef<Pagamento>[] => [
        {
            accessorKey: "reservas.codigo_reserva",
            header: "Reserva",
            cell: ({ row }) => row.original.reservas?.codigo_reserva || "N/A"
        },
        {
            accessorKey: "reservas.usuarios.nome",
            header: "Cliente",
            cell: ({ row }) => row.original.reservas?.usuarios?.nome || "N/A"
        },
        {
            accessorKey: "valor_parcela",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Valor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("valor_parcela"))
                const formatted = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount)

                return <div className="font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "metodo_pagamento",
            header: "Método",
            cell: ({ row }) => <span className="capitalize">{row.getValue("metodo_pagamento")}</span>
        },
        {
            accessorKey: "data_vencimento",
            header: "Vencimento",
            cell: ({ row }) => {
                const val = row.getValue("data_vencimento") as string;
                return val ? format(new Date(val), "dd/MM/yyyy") : "N/A";
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge variant={status === "pago" ? "default" : status === "pendente" ? "secondary" : "destructive"}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const pagamento = row.original

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(pagamento.id)}>
                                Copiar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onUpdateStatus(pagamento, 'pago')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Marcar como Pago
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(pagamento, 'pendente')}>
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                Marcar como Pendente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(pagamento, 'cancelado')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Marcar como Cancelado
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
