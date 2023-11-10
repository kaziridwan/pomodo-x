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
    next: "focus_3",
  },
  "focus_3": {
    previous: "break_2",
    next: "break_3",
  },
  "break_3": {
    previous: "focus_3",
    next: "focus_4",
  },
  "focus_4": {
    previous: "break_3",
    next: "break_4",
  },
  "break_4": {
    previous: "focus_4",
    next: "focus_5",
  },
  "focus_5": {
    previous: "break_4",
    next: "break_5",
  },
  "break_5": {
    previous: "focus_5",
    next: "focus_6",
  },
  "focus_6": {
    previous: "break_5",
    next: "break_6",
  },
  "break_6": {
    previous: "focus_6",
    next: "focus_7",
  },
  "focus_7": {
    previous: "break_6",
    next: "break_7",
  },
  "break_7": {
    previous: "focus_7",
    next: "focus_2",
  },
  "focus_8": {
    previous: "break_1",
    next: "break_4",
  },
  "break_8": {
    previous: "focus_2",
    next: "refresh",
  },
  "refresh": {
    previous: "break_2",
    next: "focus_1",
  },
}