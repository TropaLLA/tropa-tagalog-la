export type Clue = {
  emoji: string;
  tagalog: string;
  english: string;
  /** true = the translation is shown from the start. false = shown as ??? until the puzzle is solved. */
  given: boolean;
};

export type Puzzle = {
  id: string;
  title: string;
  clues: Clue[];
  /** Mystery word (lowercase, no punctuation) -> accepted answers. The first one is the "official" meaning. */
  meanings: Record<string, string[]>;
  /** Shown after the player solves it. */
  note: string;
};

export const PUZZLES: Puzzle[] = [
  {
    id: "tindahan",
    title: "Sa Tindahan",
    clues: [
      { emoji: "🛒", tagalog: "Bumili si Ana ng tubig.", english: "Ana bought water.", given: true },
      { emoji: "☕", tagalog: "Bumili si Ben ng kape.", english: "Ben bought coffee.", given: true },
      { emoji: "🥤", tagalog: "Uminom si Ben ng tubig.", english: "Ben drank water.", given: false },
      { emoji: "😋", tagalog: "Uminom si Ana ng kape.", english: "Ana drank coffee.", given: false },
    ],
    meanings: {
      bumili: ["bought", "buy", "buys", "buying", "purchase", "purchased"],
      tubig: ["water"],
      kape: ["coffee"],
      uminom: ["drank", "drink", "drinks", "drinking"],
    },
    note: "Si goes before a person's name and ng comes before the thing. Notice the -um- in bumili and uminom: bili becomes bumili and inom becomes uminom. It's the same trick in both verbs.",
  },
  {
    id: "pagkain",
    title: "Pagkain",
    clues: [
      { emoji: "🥭", tagalog: "Kumain si Ana ng mangga.", english: "Ana ate a mango.", given: true },
      { emoji: "🛍️", tagalog: "Bumili si Ben ng mangga.", english: "Ben bought a mango.", given: true },
      { emoji: "🍞", tagalog: "Kumain si Ben ng tinapay.", english: "Ben ate bread.", given: false },
      { emoji: "🛒", tagalog: "Bumili si Ana ng tinapay.", english: "Ana bought bread.", given: false },
    ],
    meanings: {
      kumain: ["ate", "eat", "eats", "eating"],
      bumili: ["bought", "buy", "buys", "buying", "purchase", "purchased"],
      mangga: ["mango"],
      tinapay: ["bread"],
    },
    note: "The -um- again: kain becomes kumain, just like bili becomes bumili and inom becomes uminom. Once you can spot that pattern, you can start recognizing verbs you've never seen.",
  },
  {
    id: "lola",
    title: "Kay Lola",
    clues: [
      { emoji: "👵", tagalog: "Salamat po, Lola.", english: "Thank you, Grandma.", given: true },
      { emoji: "🧑", tagalog: "Salamat, Ben.", english: "Thank you, Ben.", given: true },
      { emoji: "👨", tagalog: "Kain po, Kuya.", english: "Eat, big brother.", given: true },
      { emoji: "🍚", tagalog: "Kain, Ben.", english: "Eat, Ben.", given: false },
    ],
    meanings: {
      salamat: ["thank you", "thanks", "thank"],
      po: [
        "respect word",
        "respect",
        "polite",
        "polite word",
        "politeness",
        "honorific",
        "sign of respect",
        "sir",
        "maam",
        "sir maam",
        "formal",
        "nothing",
        "no meaning",
        "no translation",
      ],
      lola: ["grandma", "grandmother", "granny"],
      kain: ["eat", "eats", "eating"],
      kuya: ["big brother", "older brother", "elder brother", "brother"],
    },
    note: "Po has no English translation. It's a small word that shows respect, which you add when talking to elders or people older than you (Lola, Kuya) and leave off with a peer like Ben. Notice that no English sentence had a word left over for it.",
  },
  {
    id: "kumusta",
    title: "Kumusta?",
    clues: [
      { emoji: "👋", tagalog: "Kumusta ka?", english: "How are you?", given: true },
      { emoji: "🙂", tagalog: "Mabuti ako.", english: "I am good.", given: true },
      { emoji: "😊", tagalog: "Mabuti si Ben.", english: "Ben is good.", given: true },
      { emoji: "🧑", tagalog: "Kumusta si Ben?", english: "How is Ben?", given: true },
      { emoji: "❓", tagalog: "Mabuti ka ba?", english: "Are you good?", given: false },
    ],
    meanings: {
      kumusta: ["how", "how are", "how are you", "how is", "how is it"],
      ka: ["you"],
      mabuti: ["good", "well", "fine"],
      ako: ["i", "me", "i am"],
      ba: [
        "question",
        "question word",
        "question marker",
        "question particle",
        "asks a question",
        "yes or no question",
      ],
    },
    note: "Ba doesn't translate. It turns a statement into a yes-or-no question: mabuti ka (you're good) becomes mabuti ka ba? (are you good?). Also notice Tagalog doesn't need a word for am, is, or are. Mabuti ako is just 'good, I'.",
  },
];

/** Lowercase a token and strip punctuation so it can match a key in `meanings`. */
export const keyOf = (token: string) => token.replace(/[.,!?]/g, "").toLowerCase();

/** The mystery words in the order they first appear in the sentences. */
export function wordsInOrder(p: Puzzle): string[] {
  const seen: string[] = [];
  for (const clue of p.clues) {
    for (const token of clue.tagalog.split(/\s+/)) {
      const k = keyOf(token);
      if (k in p.meanings && !seen.includes(k)) seen.push(k);
    }
  }
  return seen;
}

/** Normalizes a typed guess: lowercase, no punctuation, no leading "to/a/an/the". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(to|a|an|the) /, "");

export function isMatch(p: Puzzle, word: string, guess: string): boolean {
  const g = normalize(guess);
  return g.length > 0 && p.meanings[word].some((a) => normalize(a) === g);
}

/** Same puzzle for everyone on a given day, no backend needed (used for the daily challenge later). */
export function puzzleOfTheDay(date = new Date()): Puzzle {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return PUZZLES[day % PUZZLES.length];
}
