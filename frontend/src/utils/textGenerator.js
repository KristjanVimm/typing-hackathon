export const TEXTS = {
  easy: [
    "the cat sat on the mat and looked at the sun all day",
    "she sells sea shells by the sea shore every morning",
    "the dog ran fast and jumped over the low wooden fence",
    "a red ball rolled down the big green hill near our house",
    "my friend likes to read books and drink hot tea at night",
  ],
  medium: [
    "the quick brown fox jumps over the lazy dog near the river bank",
    "learning to type faster takes practice patience and persistence every day",
    "good software is written by people who truly care about their craft",
    "every line of code you write is a small decision that matters",
    "pack my box with five dozen liquor jugs before the evening party",
  ],
  hard: [
    "sphinx of black quartz judge my vow as the old wizard quickly explained",
    "debugging is twice as hard as writing the original code in the first place",
    "we promptly judged antique ivory buckles for the very next regional prize show",
    "two driven jocks help fax my big quiz answers to twelve remote villages",
    "the five boxing wizards jumped quickly and knocked over the ancient ceramic vase",
  ],
};

export function generateText(difficulty = 'medium') {
  const pool = TEXTS[difficulty] || TEXTS.medium;
  return pool[Math.floor(Math.random() * pool.length)];
}
