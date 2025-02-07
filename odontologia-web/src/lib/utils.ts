import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getBloackedTimes } from '@/services/timeServices';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function bloeckedTimesHandle (selectedDate: Date | undefined, availableTimes: string[]) {
    const blockedTimes = await getBloackedTimes(selectedDate, availableTimes);
    return blockedTimes;
};