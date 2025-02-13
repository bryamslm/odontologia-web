import { supabase } from "@/lib/supabaseClient";

/**
 * Interface for an appointment
 */
export interface Cita { 
    hora_cita: string;
}

/**
 * Retrieves blocked times for a selected date from the Supabase database.
 *
 * @param {Date | undefined} selectedDate - The date to check for blocked times.
 * @param {string[]} availableTimes - The array of available time slots.
 * @returns {Promise<string[]>} - A promise that resolves to an array of blocked times.
 */
export const getBlockedTimes = async (selectedDate: Date | undefined, availableTimes: string[]): Promise<string[]> => {
    // Format the selected date to "YYYY-MM-DD" if provided
    const formattedSelectedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    // Query Supabase to check for appointments on the selected date
    const { data , error } = await supabase.from("citas").select("*").eq("fecha_cita", formattedSelectedDate);

    // Handle any errors from the query
    if (error) {
        console.log("ERROR: ", error);
        return [];
    }

    const blockedTimesL: string[] = [];
    if (data) {
        data.map((cita: Cita) => {
            // Extract the appointment time in "HH:MM" format
            const time = cita.hora_cita.split(":").slice(0, 2).join(":");
            // Check if the appointment time is in the available times array
            if (availableTimes.includes(time)) {
                // If it is, add it to the blocked times array
                blockedTimesL.push(time);
            }
        });
    }

    console.log("blockedTimesL: ", blockedTimesL);
    return blockedTimesL;
}