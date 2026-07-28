type TimeOfDay = { hours: number; minutes: number };

type DeliveryDateOption = { value: string; label: string };
type DeliveryTimeOption = { value: string; label: string };

const DEFAULT_WORKING_HOURS_START: TimeOfDay = { hours: 7, minutes: 0 };
const DEFAULT_WORKING_HOURS_END: TimeOfDay = { hours: 15, minutes: 0 };
const DEFAULT_DELIVERY_HOURS_START: TimeOfDay = { hours: 9, minutes: 0 };
const DEFAULT_DELIVERY_HOURS_END: TimeOfDay = { hours: 18, minutes: 0 };

function parseTime(value: string | undefined, fallback: TimeOfDay): TimeOfDay {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
  if (!match) return fallback;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return fallback;

  return { hours, minutes };
}

function toMinutes(time: TimeOfDay): number {
  return time.hours * 60 + time.minutes;
}

function formatTime(time: TimeOfDay): string {
  const reference = new Date();
  reference.setHours(time.hours, time.minutes, 0, 0);
  return reference.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useDeliverySchedule() {
  const config = useRuntimeConfig();

  const workingHours = {
    start: parseTime(config.public.workingHoursStart, DEFAULT_WORKING_HOURS_START),
    end: parseTime(config.public.workingHoursEnd, DEFAULT_WORKING_HOURS_END),
  };

  const deliveryHours = {
    start: parseTime(config.public.deliveryHoursStart, DEFAULT_DELIVERY_HOURS_START),
    end: parseTime(config.public.deliveryHoursEnd, DEFAULT_DELIVERY_HOURS_END),
  };

  /**
   * Orders placed before the working hour limit (workingHours.end) can be
   * delivered the next day; past that limit they move to the day after next.
   */
  const getEarliestDeliveryDate = (now: Date = new Date()): Date => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const withinWorkingHours = nowMinutes < toMinutes(workingHours.end);
    return startOfDay(addDays(now, withinWorkingHours ? 1 : 2));
  };

  const getDeliveryDateOptions = (daysToShow = 6, now: Date = new Date()): DeliveryDateOption[] => {
    const earliest = getEarliestDeliveryDate(now);

    return Array.from({ length: daysToShow }, (_, index) => {
      const date = addDays(earliest, index);
      return {
        value: toDateInputValue(date),
        label: date.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      };
    });
  };

  const deliveryTimeSlots = computed<DeliveryTimeOption[]>(() => {
    const startTotal = toMinutes(deliveryHours.start);
    const endTotal = toMinutes(deliveryHours.end);
    const slots: DeliveryTimeOption[] = [];

    for (let minutes = startTotal; minutes + 30 <= endTotal; minutes += 30) {
      const from: TimeOfDay = { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
      const toTotal = minutes + 30;
      const to: TimeOfDay = { hours: Math.floor(toTotal / 60), minutes: toTotal % 60 };

      slots.push({
        value: `${String(from.hours).padStart(2, "0")}:${String(from.minutes).padStart(2, "0")}`,
        label: `${formatTime(from)} - ${formatTime(to)}`,
      });
    }

    return slots;
  });

  return {
    workingHours,
    deliveryHours,
    getEarliestDeliveryDate,
    getDeliveryDateOptions,
    deliveryTimeSlots,
    toDateInputValue,
  };
}
