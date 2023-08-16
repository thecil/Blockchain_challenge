const MS = 1000;

export const toUnixTime = (date: Date) => {
  if (!date) return 0;
  date = new Date(date);
  return Math.floor(date.valueOf() / MS);
};

export const unixNow = () => toUnixTime(new Date());
