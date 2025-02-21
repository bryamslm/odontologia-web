// components/admin/PatientRecord.tsx
'use client'
import { User, Calendar, FileText, Clipboard } from 'lucide-react'

interface PatientRecordProps {
  paciente: {
    nombre: string
    cedula: string
    telefono: string
    correo: string
    citas: Array<{
      fecha: string
      tipo: string
      estado: string
      notas: string
    }>
  }
}

export default function PatientRecord({ paciente }: PatientRecordProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <User className="text-blue-600" /> {paciente.nombre}
        </h2>
        <p className="text-gray-600 mt-2">Cédula: {paciente.cedula}</p>
        <div className="flex gap-4 mt-2">
          <a href={`tel:${paciente.telefono}`} className="text-blue-600 hover:underline">
            📞 {paciente.telefono}
          </a>
          <a href={`mailto:${paciente.correo}`} className="text-blue-600 hover:underline">
            ✉️ {paciente.correo}
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="text-green-600" /> Historial de Citas
          </h3>
          <div className="space-y-3">
            {paciente.citas.map((cita, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{new Date(cita.fecha).toLocaleDateString()}</p>
                    <p className="text-gray-600">{cita.tipo}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                    cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cita.estado}
                  </span>
                </div>
                {cita.notas && (
                  <p className="mt-2 text-gray-600 text-sm">📝 Notas: {cita.notas}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clipboard className="text-purple-600" /> Notas Clínicas
          </h3>
          <textarea
            className="w-full p-3 border rounded-md"
            placeholder="Agregar notas médicas..."
            rows={4}
          />
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Guardar Notas
          </button>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-red-600" /> Documentos Adjuntos
          </h3>
          <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center">
            <p className="text-gray-600">Arrastra archivos o haz clic para subir</p>
            <input type="file" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="inline-block mt-2 text-blue-600 cursor-pointer">
              Seleccionar archivos
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}