function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    // weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return formattedDate.replace(/\d+/, `${day}${suffix}`);
}

export default formatDate;
