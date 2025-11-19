// app/admin/rooms/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Quarto } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// As ações agora recebem handlers como props
interface CellActionsProps {
  quarto: Quarto;
  onEdit: (quarto: Quarto) => void;
  onDelete: (quarto: Quarto) => void;
}

const CellActions = ({ quarto, onEdit, onDelete }: CellActionsProps) => {
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
        <DropdownMenuItem onClick={() => onEdit(quarto)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(quarto)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const getColumns = (
  onEdit: (quarto: Quarto) => void,
  onDelete: (quarto: Quarto) => void
): ColumnDef<Quarto>[] => [
    {
      accessorKey: "numero",
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
      accessorKey: "tipo_quarto",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo_quarto") as string;
        return <span className="capitalize">{tipo.replace('_', ' ')}</span>
      }
    },
    {
      accessorKey: "capacidade",
      header: "Capacidade",
      cell: ({ row }) => <div className="text-center">{row.getValue("capacidade")}</div>
    },
    {
      accessorKey: "preco_base",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Preço Base
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("preco_base"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => {
        const ativo = row.getValue("ativo") as boolean;
        return (
          <Badge variant={ativo ? "default" : "secondary"}>
            {ativo ? "Ativo" : "Inativo"}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => <CellActions quarto={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
  ]
