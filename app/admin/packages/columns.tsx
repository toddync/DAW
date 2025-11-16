// app/admin/packages/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PacoteQuarto } from "@/lib/types"
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
import { format } from "date-fns"

// As ações agora recebem handlers como props
interface CellActionsProps {
  pacoteQuarto: PacoteQuarto;
  onEdit: (pacoteQuarto: PacoteQuarto) => void;
  onDelete: (pacoteQuarto: PacoteQuarto) => void;
}

const CellActions = ({ pacoteQuarto, onEdit, onDelete }: CellActionsProps) => {
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
        <DropdownMenuItem onClick={() => onEdit(pacoteQuarto)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(pacoteQuarto)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// A exportação de colunas agora é uma função que aceita os handlers
export const getColumns = (
    onEdit: (pacoteQuarto: PacoteQuarto) => void,
    onDelete: (pacoteQuarto: PacoteQuarto) => void
): ColumnDef<PacoteQuarto>[] => [
  {
    accessorKey: "pacotes.nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pacote
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => row.original.pacotes?.nome || 'N/A',
  },
  {
    accessorKey: "quartos.numero",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quarto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => `Nº ${row.original.quartos?.numero} (${row.original.quartos?.tipo_quarto})` || 'N/A',
  },
  {
    accessorKey: "data_inicio",
    header: "Início",
    cell: ({ row }) => format(new Date(row.getValue("data_inicio")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "data_fim",
    header: "Fim",
    cell: ({ row }) => format(new Date(row.getValue("data_fim")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "preco_total_pacote",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Preço Total
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("preco_total_pacote"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "fechar_quarto",
    header: "Fechar Quarto",
    cell: ({ row }) => {
        return row.getValue("fechar_quarto") ? "Sim" : "Não";
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions pacoteQuarto={row.original} onEdit={onEdit} onDelete={onDelete} />,
  },
]
