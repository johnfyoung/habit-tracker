import { convertUTCDateToLocalDate } from "./date";

export const isHabitCompleted = (habit, localDate) => {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return false;
  }

  const currentLocalDate = localDate || new Date();
  // console.log("currentLocalDate", currentLocalDate);
  const currentLocalDateString = currentLocalDate.toLocaleDateString();
  // console.log("currentLocalDateString", currentLocalDateString);

  switch (habit.frequency.toLowerCase()) {
    case "daily":
      return habit.completedDates.some((date) => {
        // const dateLocal = convertUTCDateToLocalDate(new Date(date));
        const dateLocal = new Date(date);
        const dateLocalString = dateLocal.toLocaleDateString();

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

export const wasHabitCompletedOnThisDate = (habit, date) => {
  const currentDateLocal = new Date(date);
  const currentDateLocalString = currentDateLocal.toLocaleDateString();
  console.log(
    `Filling out the calendar...is there an entry for ${currentDateLocalString}...`
  );
  return habit.completedDates.some((date) => {
    const dateLocal = new Date(date);
    const dateLocalString = dateLocal.toLocaleDateString();

    const isMatch = dateLocalString === currentDateLocalString;
    if (isMatch) {
      console.log(
        `matched dateLocalString ${dateLocalString}, dateLocal: ${dateLocal}`
      );
    }

    return isMatch;
  });
};

export const getLastCompletedDate = (habit) => {
  if (!habit?.completedDates || habit.completedDates.length === 0) {
    return null;
  }
  return new Date(
    Math.max(...habit.completedDates.map((d) => new Date(d).getTime()))
  );
};
