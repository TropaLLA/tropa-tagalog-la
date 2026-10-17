export type Step = {
  prompt: string;          // what the mascot says (Tagalog)
  translation: string;     // English meaning of the prompt (shown in hints)
  answers: string[];       // accepted answers
  hint: string;            // model answer (shown in hints)
  hintTranslation: string; // English meaning of the model answer
  mistakes?: { contains: string; feedback: string }[]; // specific corrections
};

export type Lesson = {
  slug: string;
  title: string;
  blurb: string;
  intro: string;
  outro: string;
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
    steps: [
      {
        prompt: "Saan ka pupunta?",
        translation: "Where are you going?",
        answers: ["Pupunta ako sa istasyon", "Sa istasyon"],
        hint: "Pupunta ako sa istasyon.",
        hintTranslation: "I'm going to the station.",
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
      },
      {
        prompt: "Nasaan ang mall?",
        translation: "Where is the mall?",
        answers: ["Nasa kanan ang mall", "Nasa kaliwa ang mall", "Diretso lang"],
        hint: "Nasa kanan ang mall.",
        hintTranslation: "The mall is on the right.",
      },
      {
        prompt: "Malayo ba ang istasyon?",
        translation: "Is the station far?",
        answers: ["Hindi malapit lang", "Malapit lang", "Oo malayo"],
        hint: "Hindi, malapit lang.",
        hintTranslation: "No, it's close.",
      },
      {
        prompt: "Salamat po!",
        translation: "Thank you!",
        answers: ["Walang anuman", "Walang anuman po"],
        hint: "Walang anuman.",
        hintTranslation: "You're welcome.",
      },
    ],
  },
  {
    slug: "restaurant",
    title: "Restaurants & Cafes",
    blurb: "Order food and ask what a dish is",
    intro: "Maligayang pagdating! Welcome to the restaurant.",
    outro: "Tapos na! Time to eat.",
    steps: [
      {
        prompt: "Ano ang gusto mo?",
        translation: "What would you like?",
        answers: ["Gusto ko ng adobo"],
        hint: "Gusto ko ng adobo.",
        hintTranslation: "I want adobo.",
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
      },
      {
        prompt: "Tanungin mo ako ng presyo.",
        translation: "Ask me the price.",
        answers: ["Magkano ito", "Magkano po ito", "Magkano ang adobo"],
        hint: "Magkano ito?",
        hintTranslation: "How much is this?",
      },
      {
        prompt: "Masarap ba?",
        translation: "Is it delicious?",
        answers: ["Oo masarap", "Masarap"],
        hint: "Oo, masarap!",
        hintTranslation: "Yes, it's delicious!",
      },
    ],
  },
  {
    slug: "daily",
    title: "Daily Conversation",
    blurb: "Weather, feelings, and plans",
    intro: "Kumusta! Let's chat about your day.",
    outro: "Tapos na! Great chat.",
    steps: [
      {
        prompt: "Kumusta ka?",
        translation: "How are you?",
        answers: ["Mabuti ako", "Mabuti naman ako", "Okay lang ako", "Masaya ako"],
        hint: "Mabuti ako.",
        hintTranslation: "I'm good.",
      },
      {
        prompt: "Kumusta ang panahon?",
        translation: "How's the weather?",
        answers: ["Mainit ngayon", "Maulan ngayon", "Maaraw ngayon"],
        hint: "Mainit ngayon.",
        hintTranslation: "It's hot today.",
      },
      {
        prompt: "Ano ang ginawa mo kahapon?",
        translation: "What did you do yesterday?",
        answers: ["Nag-aral ako kahapon"],
        hint: "Nag-aral ako kahapon.",
        hintTranslation: "I studied yesterday.",
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
      },
    ],
  },
];

export function getLesson(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}