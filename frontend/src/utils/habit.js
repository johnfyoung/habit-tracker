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
      if (habit.allowComments) {
        return habit.completions.some((completion) => {
          // const dateLocal = convertUTCDateToLocalDate(new Date(date));
          const dateLocal = new Date(completion.date);
          const dateLocalString = dateLocal.toLocaleDateString();

          return dateLocalString === currentLocalDateString;
        });
      } else {
        return habit.completedDates.some((date) => {
          // const dateLocal = convertUTCDateToLocalDate(new Date(date));
          const dateLocal = new Date(date);
          const dateLocalString = dateLocal.toLocaleDateString();

          return dateLocalString === currentLocalDateString;
        });
      }

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

// TODO this is out of date
export const wasHabitCompletedOnThisDate = (habit, date) => {
  const currentDateLocal = new Date(date);
  const currentDateLocalString = currentDateLocal.toLocaleDateString();

  const hasCompletedDate = habit.completedDates.some((date) => {
    const dateLocal = new Date(date);
    const dateLocalString = dateLocal.toLocaleDateString();

    return dateLocalString === currentDateLocalString;
  });

  const hasCompletedDateWithComment = habit.completions.some((completion) => {
    const dateLocal = new Date(completion.date);
    const dateLocalString = dateLocal.toLocaleDateString();
    return dateLocalString === currentDateLocalString;
  });

  return hasCompletedDate || hasCompletedDateWithComment;
};

export const getLastCompletedDate = (habit) => {
  if (
    (!habit?.completedDates || habit.completedDates.length === 0) &&
    (!habit?.completions || habit.completions.length === 0)
  ) {
    return null;
  }

  let maxDate = null;
  if (habit?.completedDates) {
    maxDate = new Date(
      Math.max(...habit.completedDates.map((d) => new Date(d).getTime()))
    );
  }

  if (habit?.completions && habit.completions.length > 0) {
    // const dates = habit.completions.map((completion) =>
    //   new Date(completion.date).getTime()
    // );
    // const maxDate = Math.max(...dates);

    // console.log(`Max date: ${maxDate}`);
    // console.log(dates);
    const maxCompletionDate = new Date(
      Math.max(
        ...habit.completions.map((completion) =>
          new Date(completion.date).getTime()
        )
      )
    );

    maxDate = maxDate > maxCompletionDate ? maxDate : maxCompletionDate;
  }

  return maxDate;
};
