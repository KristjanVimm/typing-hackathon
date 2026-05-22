// PHASE 1: sample data for development and hackathon demo.
// PHASE 2: delete this file and pipe real sessionHistory from useTypingEngine.

export const SAMPLE_SESSIONS = [
  { session: 1,  wpm: 22, accuracy: 74.2, duration: 88, letterPool: ['a','s','d','f','j','k'],             errors: { f:5, j:4, k:3, d:2, s:1 } },
  { session: 2,  wpm: 25, accuracy: 77.8, duration: 81, letterPool: ['a','s','d','f','j','k'],             errors: { f:4, j:3, k:3, d:2, a:1 } },
  { session: 3,  wpm: 24, accuracy: 79.1, duration: 95, letterPool: ['a','s','d','f','j','k','e','i'],     errors: { j:5, e:4, i:3, f:2, k:1 } },
  { session: 4,  wpm: 29, accuracy: 81.5, duration: 76, letterPool: ['a','s','d','f','j','k','e','i'],     errors: { e:4, i:4, j:2, f:2, k:1 } },
  { session: 5,  wpm: 31, accuracy: 83.0, duration: 70, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { r:6, t:5, e:3, i:2, j:1 } },
  { session: 6,  wpm: 28, accuracy: 80.3, duration: 85, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { r:5, t:4, e:3, f:2, i:1 } },
  { session: 7,  wpm: 34, accuracy: 85.7, duration: 68, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { t:4, r:3, e:2, i:2, j:1 } },
  { session: 8,  wpm: 37, accuracy: 87.2, duration: 62, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:5, o:4, t:2, r:2, e:1 } },
  { session: 9,  wpm: 36, accuracy: 88.0, duration: 65, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:4, o:3, t:2, r:1, e:1 } },
  { session: 10, wpm: 41, accuracy: 90.1, duration: 58, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:3, o:2, t:2, r:1, e:1 } },
];

// Each session shape — this is the contract. Do not change field names.
// {
//   session:    number      — 1-indexed session number
//   wpm:        number      — words per minute (integer)
//   accuracy:   number      — percentage, 1 decimal place, 0-100
//   duration:   number      — seconds taken to complete the lesson
//   letterPool: string[]    — active letter pool at end of this session
//   errors:     { [key: string]: number }  — per-key error count for the session
// }
