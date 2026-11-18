export const createGreeter =
  (greeting: string) =>
  (name: string): string =>
    `${greeting}, ${name}`;
