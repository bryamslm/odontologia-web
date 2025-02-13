import { memo } from 'react';

interface TimeSlotButtonProps {
  time: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

/**
 * TimeSlotButton component to display a selectable time slot button.
 * Uses React.memo for performance optimization.
 *
 * @param {TimeSlotButtonProps} props - The properties for the button component.
 * @returns {JSX.Element} - The rendered button component.
 */
export const TimeSlotButton = memo(({ time, selected, disabled, onClick }: TimeSlotButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg border-2 text-sm text-black ${selected ? 'bg-blue-50 text-black border-blue-500 ' : 'border-gray-200 hover:bg-blue-50'
      } ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100'}`}
  >
    {time}
  </button>
));

TimeSlotButton.displayName = 'TimeSlotButton';