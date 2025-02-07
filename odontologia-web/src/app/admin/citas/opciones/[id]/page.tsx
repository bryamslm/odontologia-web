import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RechazarCitaUI from "@/app/admin/citas/opciones/[id]/rechazarCitaUI";
import Link from "next/link";

async function getCita(id: string) {
  // pasar id a número
  const idNum = parseInt(id, 10);
  // buscar cita en la base de datos
  const { data, error } = await supabase
    .from("citas")
    .select("*")
    .eq("numero", idNum)
    .single();

  if (error) {
    console.log("Error al obtener la cita:", error.message);
    return null;
  }
  // retornar la cita como objeto json
  return data;
}

function AdminHeader() {
    return (
      <header className="bg-transparent shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-500">FlowDent</div>
        <Link href="/admin" className="text-blue-500 hover:underline">
          Panel Admin
        </Link>
      </header>
    );
  }

  // Footer simplificado (opcional)
function AdminFooter() {
    return (
      <footer className="bg-gray-900 text-white py-4 text-center text-xs">
        © {new Date().getFullYear()} FlowDent. Todos los derechos reservados.
      </footer>
    );
  }

export default async function CancelarCitaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Esperamos a que params se resuelva
  const resolvedParams = await params;
  console.log("params: ", resolvedParams);

  const cita = await getCita(resolvedParams.id);
  if (!cita) notFound();
  return (
    <div className="min-h-screen flex flex-col from-blue-50 to-white bg-white">
      {/* Header minimal para la doctora */}
      <AdminHeader />

      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-1">
        <RechazarCitaUI cita={cita} />
      </main>

      {/* Footer simplificado */}
      <AdminFooter />
    </div>
    );
}
