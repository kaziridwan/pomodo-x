export const minutes = (minCount: number) => (minCount*60*1000);
export const toMinutes = (msCount: number) => (msCount/(60*1000));

interface StageObject {
  [key: string]: {
    previous : string,
    next : string,
  };
}
export const stages : StageObject = {
  "focus_1": {
    previous: "refresh",
    next: "break_1",
  },
  "break_1": {
    previous: "focus_1",
    next: "focus_2",
  },
  "focus_2": {
    previous: "break_1",
    next: "break_2",
  },
  "break_2": {
    previous: "focus_2",
    next: "refresh",
  },
  "refresh": {
    previous: "break_2",
    next: "focus_1",
  },
}