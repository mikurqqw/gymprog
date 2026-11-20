import { useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
export function Stepper({
  label,
  value,
  min = 0,
  max,
  step,
  disabled,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  unit?: string;
}) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null),
    repeat = useRef<ReturnType<typeof setInterval> | null>(null),
    latest = useRef(value),
    change = useRef(onChange);
  useEffect(() => {
    latest.current = value;
    change.current = onChange;
  }, [value, onChange]);
  const stop = () => {
    if (timeout.current) clearTimeout(timeout.current);
    if (repeat.current) clearInterval(repeat.current);
  };
  useEffect(() => stop, []);
  const adjust = (direction: number) => {
    const next = Math.min(
      max,
      Math.max(min, Math.round((latest.current + direction * step) * 100) / 100),
    );
    latest.current = next;
    change.current(next);
  };
  const button = (direction: number) => (
    <button
      type="button"
      className="icon-button"
      aria-label={label + (direction < 0 ? ' −' : ' +')}
      disabled={disabled || (direction < 0 ? value <= min : value >= max)}
      onClick={(event) => {
        if (event.detail === 0) adjust(direction);
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        adjust(direction);
        stop();
        timeout.current = setTimeout(() => {
          repeat.current = setInterval(() => adjust(direction), 120);
        }, 450);
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onBlur={stop}
    >
      {direction < 0 ? <Minus size={20} /> : <Plus size={20} />}
    </button>
  );
  return (
    <div className="focus-stepper">
      <span>{label}</span>
      <div>
        {button(-1)}
        <label>
          <span className="sr-only">{label}</span>
          <input
            type="number"
            inputMode="decimal"
            aria-label={label}
            value={value}
            min={min}
            max={max}
            step="any"
            disabled={disabled}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          {unit && <small>{unit}</small>}
        </label>
        {button(1)}
      </div>
    </div>
  );
}
