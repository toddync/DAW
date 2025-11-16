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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(quarto)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// A exportação de colunas agora é uma função que aceita os handlers
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
  },
  {
    accessorKey: "capacidade",
    header: "Capacidade",
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
    header: "Ativo",
    cell: ({ row }) => {
        return row.getValue("ativo") ? "Sim" : "Não";
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions quarto={row.original} onEdit={onEdit} onDelete={onDelete} />,
  },
]
