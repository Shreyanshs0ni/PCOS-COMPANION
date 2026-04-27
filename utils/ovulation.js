import { addDays, parseISO, format } from "date-fns";

export function calculateOvulation(startDate, averageCycleLength = 28) {
  if (!startDate) return null;
  
  // Ovulation usually occurs 14 days before the next period
  const daysToOvulation = averageCycleLength - 14;
  const ovulationDay = addDays(parseISO(startDate), daysToOvulation);
  
  return {
    windowStart: format(addDays(ovulationDay, -2), "MMM d"),
    windowEnd: format(addDays(ovulationDay, 2), "MMM d"),
    exactDate: format(ovulationDay, "MMM d, yyyy")
  };
}
