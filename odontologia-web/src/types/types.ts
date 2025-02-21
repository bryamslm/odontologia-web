// types.ts
export interface Cita {
    id: string;
    nombre_paciente: string;
    cedula_paciente: string;
    correo_paciente: string;
    telefono_paciente: string;
    fecha_cita: string; // Formato ISO 8601 'YYYY-MM-DD'
    hora_cita: string;  // Formato 'HH:MM'
    tipo_cita: string;
    created_at: string;
    estado?: 'Solicitada' | 'Confirmada' | 'Completada' | 'Cancelada' | 'Reprogramada';
    notas?: string;
    whatsapp_message_id?: string;
  }
  
  export interface Paciente {
    id?: string;
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    user_id?: string; // Solo para pacientes registrados
    created_at?: string;
  }