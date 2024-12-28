import { convertUTCDateToLocalDate } from "./date";

export const isHabitCompleted = (habit, localDate) => {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return false;
  }

  const currentLocalDate = localDate || new Date();
  const currentLocalDateString = currentLocalDate.toISOString().split("T")[0];

  switch (habit.frequency.toLowerCase()) {
    case "daily":
      return habit.completedDates.some((date) => {
        const dateLocal = convertUTCDateToLocalDate(new Date(date));
        const dateLocalString = dateLocal.toISOString().split("T")[0];
        return dateLocalString === currentLocalDateString;
      });
    case "weekly":
      const weekStartLocal = new Date(
        currentLocalDate.getFullYear(),
        currentLocalDate.getMonth(),
        currentLocalDate.getDate() - currentLocalDate.getDay()
      );
      return habit.completedDates.some(
        (date) => convertUTCDateToLocalDate(new Date(date)) >= weekStartLocal
      );
    case "monthly":
      return habit.completedDates.some((date) => {
        const completedDateLocal = convertUTCDateToLocalDate(new Date(date));
        return (
          completedDateLocal.getMonth() === currentLocalDate.getMonth() &&
          completedDateLocal.getFullYear() === currentLocalDate.getFullYear()
        );
      });
    default:
      return false;
  }
};

export const getLastCompletedDate = (habit) => {
  if (!habit?.completedDates || habit.completedDates.length === 0) {
    return null;
  }
  return new Date(
    Math.max(...habit.completedDates.map((d) => new Date(d).getTime()))
  );
};
