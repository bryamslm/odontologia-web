// components/admin/DataTable.tsx
'use client'
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from '@tanstack/react-table'
import { Cita } from '@/types/types'

const columnHelper = createColumnHelper<Cita>()

export default function DataTable({ citas }: { citas: Cita[] }) {
  const columns = [
    columnHelper.accessor('fecha_cita', {
      header: 'Fecha',
      cell: (info) => new Date(new Date(info.getValue()).setHours(24)).toLocaleDateString('es-CR')
    }),
    columnHelper.accessor('hora_cita', {
      header: 'Hora'
    }),
    columnHelper.accessor('nombre_paciente', {
      header: 'Paciente'
    }),
    columnHelper.accessor('tipo_cita', {
      header: 'Servicio'
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          info.getValue() === 'Confirmada' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'Solicitada' ? 'bg-yellow-100 text-yellow-800' :
          info.getValue() === 'Cancelada' ? 'bg-red-100 text-red-800' :
          info.getValue() === 'Reprogramada' ? 'bg-slate-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {info.getValue()}
        </span>
      )
    })
  ]

  const table = useReactTable({
    data: citas,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="text-left p-3 text-sm font-medium text-gray-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 border-b">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3 text-sm text-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}