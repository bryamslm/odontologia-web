"use client";

import { useEffect, useState } from 'react';
import { TimeSlotButton } from '@/components/ui/timeSlotButton'; // Asegúrate de importar tu componente
import { getBlockedTimes } from '@/services/timeServices';

export const TimeSlots = ({ 
  selectedDate,
  selectedTime,
  setSelectedTime,
  scrollAfterTypeSelection,
  selectedDateObj,
  AVAILABLE_TIMES,
  currentDate,
  currentTime
}:
{
    selectedDate: string;
    selectedTime: string | null;
    setSelectedTime: (time: string) => void;
    scrollAfterTypeSelection: (section: string) => void;
    selectedDateObj: Date | undefined;
    AVAILABLE_TIMES: string[];
    currentDate: string;
    currentTime: string;
}) => {
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  // Ejecutar bloeckedTimesHandle solo cuando cambie selectedDateObj o AVAILABLE_TIMES
  useEffect(() => {
    const fetchBlockedTimes = async () => {
      const times = await getBlockedTimes(selectedDateObj, AVAILABLE_TIMES);
      setBlockedTimes(times);
    };
    fetchBlockedTimes();
  }, [selectedDateObj, AVAILABLE_TIMES]);

  return AVAILABLE_TIMES.map((time) => {

    const sameDay = selectedDate == currentDate;
    const pastTime = time < currentTime;
    const isBlocked = blockedTimes.includes(time);

    const disabled = isBlocked || (sameDay && pastTime);
    
    return (
      <TimeSlotButton
        key={time}
        time={time}
        selected={selectedTime === time}
        disabled={disabled}
        onClick={() => { 
          if (!disabled) {
            setSelectedTime(time);
            scrollAfterTypeSelection("personalInfo");
          }
        }}
      />
    );
  });
};

export default TimeSlots;