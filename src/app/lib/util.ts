export const minutes = (minCount: number) => (minCount*60*1000);
export const toMinutes = (msCount: number) => (msCount/(60*1000));
export const toTimeString = (msCount: number) => (`${String(Math.floor(msCount/(60*1000))).padStart(2,'0')}:${String(Math.floor((msCount%(60*1000))/1000)).padStart(2,'0')}`);

interface StageObject {
  [key: string]: {
    next : string,
  };
}
export const stages : StageObject = {
  "focus_1": {
    next: "break_1",
  },
  "break_1": {
    next: "focus_2",
  },
  "focus_2": {
    next: "break_2",
  },
  "break_2": {
    next: "focus_3",
  },
  "focus_3": {
    next: "break_3",
  },
  "break_3": {
    next: "focus_4",
  },
  "focus_4": {
    next: "break_4",
  },
  "break_4": {
    next: "focus_5",
  },
  "focus_5": {
    next: "break_5",
  },
  "break_5": {
    next: "focus_6",
  },
  "focus_6": {
    next: "break_6",
  },
  "break_6": {
    next: "focus_7",
  },
  "focus_7": {
    next: "break_7",
  },
  "break_7": {
    next: "focus_8",
  },
  "focus_8": {
    next: "break_8",
  },
  "break_8": {
    next: "refresh",
  },
  "refresh": {
    next: "focus_1",
  },
}