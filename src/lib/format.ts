const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatEuro(amount: number) {
  return euro.format(amount);
}

// Month and "today" are worked out in this time zone, since servers run on UTC
const timeZone = process.env.APP_TIME_ZONE || "UTC";

// Today's date as YYYY-MM-DD
export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

// First and last day (YYYY-MM-DD) of the month containing the given date
export function monthRange(date: string) {
  const [year, month] = date.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const mm = String(month).padStart(2, "0");
  return {
    start: `${year}-${mm}-01`,
    end: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
  };
}

// "October 2026" for a YYYY-MM or YYYY-MM-DD string
export function formatMonth(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

// "Wed 28 Oct" for a YYYY-MM-DD string
export function formatDay(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
