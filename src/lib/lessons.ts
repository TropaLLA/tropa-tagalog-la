export type IntroCard = {
  word: string;      // the phrase (also what the voice reads)
  phonetic: string;  // respelling, capitals mark the stressed syllable
  meaning: string;
  emoji?: string;    // quick picture
  image?: string;    // optional real picture, e.g. "/lessons/istasyon.png" (wins over emoji)
};

export type Step = {
  prompt: string;
  translation: string;
  answers: string[];
  hint: string;
  hintTranslation: string;
  distractors?: string[]; // extra wrong-word tiles for tap-to-build
  mistakes?: { contains: string; feedback: string }[];
};

export type Lesson = {
  slug: string;
  title: string;
  blurb: string;
  intro: string;
  outro: string;
  cards: IntroCard[];
  steps: Step[];
};

// Lowercase, drop "po", and strip everything except letters so
// "Nag-aral ako." and "nag aral ako" count as the same answer.
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/\bpo\b/g, "")
    .replace(/[^a-zñ]/g, "");
}

export const LESSONS: Lesson[] = [
  {
    slug: "travel",
    title: "Travelling",
    blurb: "Directions to the station, bathroom, and mall",
    intro: "Kumusta! Let's practice asking for directions.",
    outro: "Tapos na! You finished the travel lesson.",
    cards: [
      { word: "Pupunta ako sa istasyon.", phonetic: "poo-POON-tah ah-KOH sah ees-TAHS-yohn", meaning: "I'm going to the station.", emoji: "🚉" },
      { word: "Nasaan ang banyo?", phonetic: "nah-sah-AHN ahng BAHN-yoh", meaning: "Where is the bathroom?", emoji: "🚻" },
      { word: "kanan", phonetic: "kah-NAHN", meaning: "right", emoji: "➡️" },
      { word: "kaliwa", phonetic: "kah-LEE-wah", meaning: "left", emoji: "⬅️" },
      { word: "malapit lang", phonetic: "mah-LAH-pit lahng", meaning: "just nearby", emoji: "📍" },
      { word: "Walang anuman.", phonetic: "WAH-lahng ah-NOO-mahn", meaning: "You're welcome.", emoji: "🙂" },
    ],
    steps: [
      {
        prompt: "Saan ka pupunta?",
        translation: "Where are you going?",
        answers: ["Pupunta ako sa istasyon", "Sa istasyon"],
        hint: "Pupunta ako sa istasyon.",
        hintTranslation: "I'm going to the station.",
        distractors: ["pumunta", "banyo"],
        mistakes: [
          { contains: "pumunta", feedback: "“pumunta” should be “pupunta” (you're going to go)." },
        ],
      },
      {
        prompt: "Tanungin mo ako kung nasaan ang banyo.",
        translation: "Ask me where the bathroom is.",
        answers: ["Nasaan ang banyo", "Saan ang banyo"],
        hint: "Nasaan ang banyo?",
        hintTranslation: "Where is the bathroom?",
        distractors: ["saan", "istasyon"],
      },
      {
        prompt: "Nasaan ang mall?",
        translation: "Where is the mall?",
        answers: ["Nasa kanan ang mall", "Nasa kaliwa ang mall", "Diretso lang"],
        hint: "Nasa kanan ang mall.",
        hintTranslation: "The mall is on the right.",
        distractors: ["kaliwa", "banyo"],
      },
      {
        prompt: "Malayo ba ang istasyon?",
        translation: "Is the station far?",
        answers: ["Hindi malapit lang", "Malapit lang", "Oo malayo"],
        hint: "Hindi, malapit lang.",
        hintTranslation: "No, it's close.",
        distractors: ["oo", "malayo"],
      },
      {
        prompt: "Salamat po!",
        translation: "Thank you!",
        answers: ["Walang anuman", "Walang anuman po"],
        hint: "Walang anuman.",
        hintTranslation: "You're welcome.",
        distractors: ["salamat", "kanan"],
      },
    ],
  },
  {
    slug: "restaurant",
    title: "Restaurants & Cafes",
    blurb: "Order food and ask what a dish is",
    intro: "Maligayang pagdating! Welcome to the restaurant.",
    outro: "Tapos na! Time to eat.",
    cards: [
      { word: "Gusto ko ng adobo.", phonetic: "GOOS-toh koh nahng ah-DOH-boh", meaning: "I would like adobo.", emoji: "🍛" },
      { word: "Ano ang sinigang?", phonetic: "ah-NOH ahng see-nee-GAHNG", meaning: "What is sinigang?", emoji: "🍲" },
      { word: "Magkano ito?", phonetic: "mahg-KAH-noh ee-TOH", meaning: "How much is this?", emoji: "💰" },
      { word: "masarap", phonetic: "mah-sah-RAHP", meaning: "delicious", emoji: "😋" },
    ],
    steps: [
      {
        prompt: "Ano ang gusto mo?",
        translation: "What would you like?",
        answers: ["Gusto ko ng adobo"],
        hint: "Gusto ko ng adobo.",
        hintTranslation: "I want adobo.",
        distractors: ["ako", "sinigang"],
        mistakes: [
          { contains: "gustokoadobo", feedback: "Add “ng” before the food: “Gusto ko ng adobo.”" },
        ],
      },
      {
        prompt: "Ano ang gusto mong inumin?",
        translation: "What would you like to drink?",
        answers: ["Gusto ko ng tubig", "Tubig"],
        hint: "Gusto ko ng tubig.",
        hintTranslation: "I want water.",
        distractors: ["kape", "ka"],
        mistakes: [
          { contains: "gustokotubig", feedback: "Add “ng” before the drink: “Gusto ko ng tubig.”" },
        ],
      },
      {
        prompt: "Tanungin mo ako kung ano ang sinigang.",
        translation: "Ask me what sinigang is.",
        answers: ["Ano ang sinigang", "Ano ang sinigang po"],
        hint: "Ano ang sinigang?",
        hintTranslation: "What is sinigang?",
        distractors: ["nasaan", "adobo"],
      },
      {
        prompt: "Tanungin mo ako ng presyo.",
        translation: "Ask me the price.",
        answers: ["Magkano ito", "Magkano po ito", "Magkano ang adobo"],
        hint: "Magkano ito?",
        hintTranslation: "How much is this?",
        distractors: ["ano", "iyon"],
      },
      {
        prompt: "Masarap ba?",
        translation: "Is it delicious?",
        answers: ["Oo masarap", "Masarap"],
        hint: "Oo, masarap!",
        hintTranslation: "Yes, it's delicious!",
        distractors: ["hindi", "ba"],
      },
    ],
  },
  {
    slug: "daily",
    title: "Daily Conversation",
    blurb: "Weather, feelings, and plans",
    intro: "Kumusta! Let's chat about your day.",
    outro: "Tapos na! Great chat.",
    cards: [
      { word: "Kumusta ka?", phonetic: "koo-moos-TAH kah", meaning: "How are you?", emoji: "👋" },
      { word: "Mabuti ako.", phonetic: "mah-BOO-tee ah-KOH", meaning: "I'm good.", emoji: "🙂" },
      { word: "Mainit ngayon.", phonetic: "mah-ee-NIT NGAH-yohn", meaning: "It's hot today.", emoji: "☀️" },
      { word: "Nag-aral ako kahapon.", phonetic: "nahg-ah-RAHL ah-KOH kah-HAH-pohn", meaning: "I studied yesterday.", emoji: "📚" },
      { word: "Pupunta ako sa mall bukas.", phonetic: "poo-POON-tah ah-KOH sah mawl BOO-kahs", meaning: "I'm going to the mall tomorrow.", emoji: "🛍️" },
      { word: "Sasama ako.", phonetic: "sah-SAH-mah ah-KOH", meaning: "I'll come along.", emoji: "🤝" },
    ],
    steps: [
      {
        prompt: "Kumusta ka?",
        translation: "How are you?",
        answers: ["Mabuti ako", "Mabuti naman ako", "Okay lang ako", "Masaya ako"],
        hint: "Mabuti ako.",
        hintTranslation: "I'm good.",
        distractors: ["kumusta", "ka"],
      },
      {
        prompt: "Kumusta ang panahon?",
        translation: "How's the weather?",
        answers: ["Mainit ngayon", "Maulan ngayon", "Maaraw ngayon"],
        hint: "Mainit ngayon.",
        hintTranslation: "It's hot today.",
        distractors: ["maulan", "bukas"],
      },
      {
        prompt: "Ano ang ginawa mo kahapon?",
        translation: "What did you do yesterday?",
        answers: ["Nag-aral ako kahapon"],
        hint: "Nag-aral ako kahapon.",
        hintTranslation: "I studied yesterday.",
        distractors: ["mag-aaral", "bukas"],
        mistakes: [
          { contains: "magaaral", feedback: "“mag-aaral” should be “nag-aral” (it happened yesterday)." },
        ],
      },
      {
        prompt: "Ano ang plano mo bukas?",
        translation: "What's your plan tomorrow?",
        answers: ["Pupunta ako sa mall bukas"],
        hint: "Pupunta ako sa mall bukas.",
        hintTranslation: "I'm going to the mall tomorrow.",
        distractors: ["pumunta", "kahapon"],
        mistakes: [
          { contains: "pumunta", feedback: "“pumunta” should be “pupunta” (it's tomorrow)." },
        ],
      },
      {
        prompt: "Gusto mo bang sumama sa akin?",
        translation: "Do you want to come with me?",
        answers: ["Oo sasama ako", "Sasama ako"],
        hint: "Oo, sasama ako.",
        hintTranslation: "Yes, I'll come along.",
        distractors: ["hindi", "sumama"],
      },
    ],
  },
];

export function getLesson(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}