import { supabase } from "@/lib/supabaseClient";

export const getBloackedTimes = async (selectedDate: Date | undefined, availableTimes: string[]): Promise<string[]> => {
    // Formatear la fecha a "YYYY-MM-DD" si está seleccionada
    const formattedSelectedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    // buscar en supabase si hay citas en la fecha seleccionada
    const { data , error } = await supabase.from("citas").select("*").eq("fecha_cita", formattedSelectedDate);

    //buscar en supabase si hay citas en la fecha seleccionada
    if (error) {
        console.log("ERROR: ", error);
        return [];
    }
    const blockedTimesL: string[] = [];
    if (data) {
        data.map((cita: any) => {
            // obtener hora_cita tipo Time y obetner string en formato HH:MM
            const time = cita.hora_cita.split(":").slice(0, 2).join(":");
            //nuscar si la hora de la cita ya está en el array de horas disponibles
            if (availableTimes.includes(time)) {
                //si está, agregarla al array de horas bloqueadas
                blockedTimesL.push(time);
            }
        });
    }
    console.log("blockedTimesL: ", blockedTimesL);
    return blockedTimesL;
}