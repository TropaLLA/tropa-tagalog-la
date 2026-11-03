export type IntroCard = {
  word: string;      // the phrase (also what the voice reads)
  phonetic: string;  // respelling, capitals mark the stressed syllable
  meaning: string;
  emoji?: string;
  image?: string;    // e.g. "/lessons/istasyon.png" (wins over emoji)
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

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  role: string;     // "You are a ..."
  wants: string[];  // what the learner is trying to do
  facts: string[];  // details the learner uses in their answers
  steps: Step[];
};

export type Lesson = {
  slug: string;
  title: string;
  blurb: string;
  intro: string;
  outro: string;
  cards: IntroCard[];
  scenarios: Scenario[];
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
    intro: "Kumusta! I'm a local here to help.",
    outro: "Tapos na! You finished the travel lesson.",
    cards: [
      { word: "Pupunta ako sa istasyon.", phonetic: "poo-POON-tah ah-KOH sah ees-TAHS-yohn", meaning: "I'm going to the station.", emoji: "🚉" },
      { word: "Nasaan ang banyo?", phonetic: "nah-sah-AHN ahng BAHN-yoh", meaning: "Where is the bathroom?", emoji: "🚻" },
      { word: "kanan", phonetic: "kah-NAHN", meaning: "right", emoji: "➡️" },
      { word: "kaliwa", phonetic: "kah-LEE-wah", meaning: "left", emoji: "⬅️" },
      { word: "malapit lang", phonetic: "mah-LAH-pit lahng", meaning: "just nearby", emoji: "📍" },
      { word: "Salamat po.", phonetic: "sah-LAH-maht poh", meaning: "Thank you. (polite)", emoji: "🙏" },
    ],
    scenarios: [
      {
        id: "lost",
        title: "Lost in Manila",
        emoji: "🗺️",
        role: "You are a tourist who just arrived in Manila. A friendly local wants to help you.",
        wants: ["Get to the train station", "Find a bathroom", "Thank the local"],
        facts: ["You can see the mall on your right", "The station is close, not far"],
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
            prompt: "May kailangan ka ba?",
            translation: "Do you need anything?",
            answers: ["Nasaan ang banyo", "Saan ang banyo"],
            hint: "Nasaan ang banyo?",
            hintTranslation: "Where is the bathroom?",
            distractors: ["saan", "istasyon"],
          },
          {
            prompt: "Alam mo ba kung nasaan ang mall?",
            translation: "Do you know where the mall is?",
            answers: ["Nasa kanan ang mall", "Oo nasa kanan ang mall", "Nasa kanan"],
            hint: "Nasa kanan ang mall.",
            hintTranslation: "The mall is on the right.",
            distractors: ["kaliwa", "banyo"],
            mistakes: [
              { contains: "kaliwa", feedback: "Check your scenario: the mall is on your right (kanan)." },
            ],
          },
          {
            prompt: "Malayo ba ang istasyon?",
            translation: "Is the station far?",
            answers: ["Hindi malapit lang", "Malapit lang", "Hindi malayo"],
            hint: "Hindi, malapit lang.",
            hintTranslation: "No, it's close.",
            distractors: ["oo", "malayo"],
            mistakes: [
              { contains: "oomalayo", feedback: "Check your scenario: the station is close, not far." },
            ],
          },
          {
            prompt: "Nandito na ang istasyon!",
            translation: "Here's the station!",
            answers: ["Salamat", "Salamat po", "Maraming salamat"],
            hint: "Salamat po.",
            hintTranslation: "Thank you.",
            distractors: ["walang", "anuman"],
          },
        ],
      },
    ],
  },
  {
    slug: "restaurant",
    title: "Restaurants & Cafes",
    blurb: "Order food and ask what a dish is",
    intro: "Maligayang pagdating! Welcome. I'll be your server.",
    outro: "Tapos na! Time to eat.",
    cards: [
      { word: "Gusto ko ng adobo.", phonetic: "GOOS-toh koh nahng ah-DOH-boh", meaning: "I would like adobo.", emoji: "🍛" },
      { word: "Ano ang sinigang?", phonetic: "ah-NOH ahng see-nee-GAHNG", meaning: "What is sinigang?", emoji: "🍲" },
      { word: "Magkano ito?", phonetic: "mahg-KAH-noh ee-TOH", meaning: "How much is this?", emoji: "💰" },
      { word: "masarap", phonetic: "mah-sah-RAHP", meaning: "delicious", emoji: "😋" },
      { word: "Hindi, salamat.", phonetic: "hin-DEE sah-LAH-maht", meaning: "No, thank you.", emoji: "✋" },
      { word: "tubig", phonetic: "TOO-big", meaning: "water", emoji: "💧" },
      { word: "kape", phonetic: "kah-PEH", meaning: "coffee", emoji: "☕" },
    ],
    scenarios: [
      {
        id: "dinner",
        title: "Dinner time",
        emoji: "🍛",
        role: "You are a hungry customer at a Filipino restaurant.",
        wants: [
          "Order adobo",
          "Order water to drink",
          "Find out what sinigang is",
          "Ask how much it costs",
          "Tell the server the food is delicious",
        ],
        facts: ["You've never tried sinigang", "You love the adobo!"],
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
            prompt: "May tanong ka ba?",
            translation: "Do you have a question?",
            answers: ["Ano ang sinigang", "Ano ang sinigang po"],
            hint: "Ano ang sinigang?",
            hintTranslation: "What is sinigang?",
            distractors: ["nasaan", "adobo"],
          },
          {
            prompt: "May tanong ka pa ba?",
            translation: "Do you have another question?",
            answers: ["Magkano ito", "Magkano po ito", "Magkano ang adobo"],
            hint: "Magkano ito?",
            hintTranslation: "How much is this?",
            distractors: ["ano", "iyon"],
          },
          {
            prompt: "Masarap ba ang adobo?",
            translation: "Is the adobo delicious?",
            answers: ["Oo masarap", "Masarap", "Oo masarap ang adobo"],
            hint: "Oo, masarap!",
            hintTranslation: "Yes, it's delicious!",
            distractors: ["hindi", "ba"],
          },
        ],
      },
      {
        id: "cafe",
        title: "Coffee break",
        emoji: "☕",
        role: "You are a customer at a small cafe.",
        wants: [
          "Order a coffee",
          "Ask what halo-halo is",
          "Politely say no to dessert",
          "Ask how much it costs",
          "Tell the server the coffee is delicious",
        ],
        facts: [
          "Halo-halo is a sweet, icy dessert you've heard about",
          "You're not having dessert today",
          "The coffee is great",
        ],
        steps: [
          {
            prompt: "Ano ang gusto mo?",
            translation: "What would you like?",
            answers: ["Gusto ko ng kape", "Isang kape", "Kape"],
            hint: "Gusto ko ng kape.",
            hintTranslation: "I want coffee.",
            distractors: ["tubig", "ako"],
            mistakes: [
              { contains: "gustokokape", feedback: "Add “ng” before the drink: “Gusto ko ng kape.”" },
            ],
          },
          {
            prompt: "May tanong ka ba?",
            translation: "Do you have a question?",
            answers: ["Ano ang halo-halo", "Ano ang halo-halo po"],
            hint: "Ano ang halo-halo?",
            hintTranslation: "What is halo-halo?",
            distractors: ["nasaan", "sinigang"],
          },
          {
            prompt: "Gusto mo ba ng halo-halo?",
            translation: "Do you want halo-halo?",
            answers: ["Hindi salamat", "Hindi po salamat"],
            hint: "Hindi, salamat.",
            hintTranslation: "No, thank you.",
            distractors: ["oo", "gusto"],
            mistakes: [
              { contains: "oogusto", feedback: "Check your scenario: you're not having dessert today. Say no politely." },
            ],
          },
          {
            prompt: "May tanong ka pa ba?",
            translation: "Do you have another question?",
            answers: ["Magkano ito", "Magkano po ito"],
            hint: "Magkano ito?",
            hintTranslation: "How much is this?",
            distractors: ["ano", "iyon"],
          },
          {
            prompt: "Masarap ba ang kape?",
            translation: "Is the coffee delicious?",
            answers: ["Oo masarap", "Masarap", "Oo masarap ang kape"],
            hint: "Oo, masarap!",
            hintTranslation: "Yes, it's delicious!",
            distractors: ["hindi", "ba"],
          },
        ],
      },
    ],
  },
  {
    slug: "daily",
    title: "Daily Conversation",
    blurb: "Weather, feelings, and plans",
    intro: "Kumusta! It's been a while. Let's catch up.",
    outro: "Tapos na! Great chat.",
    cards: [
      { word: "Kumusta ka?", phonetic: "koo-moos-TAH kah", meaning: "How are you?", emoji: "👋" },
      { word: "Mabuti ako.", phonetic: "mah-BOO-tee ah-KOH", meaning: "I'm good.", emoji: "🙂" },
      { word: "Mainit ngayon.", phonetic: "mah-ee-NIT NGAH-yohn", meaning: "It's hot today.", emoji: "☀️" },
      { word: "Nag-aral ako kahapon.", phonetic: "nahg-ah-RAHL ah-KOH kah-HAH-pohn", meaning: "I studied yesterday.", emoji: "📚" },
      { word: "Pupunta ako sa mall bukas.", phonetic: "poo-POON-tah ah-KOH sah mawl BOO-kahs", meaning: "I'm going to the mall tomorrow.", emoji: "🛍️" },
      { word: "Sasama ako.", phonetic: "sah-SAH-mah ah-KOH", meaning: "I'll come along.", emoji: "🤝" },
    ],
    scenarios: [
      {
        id: "catchup",
        title: "Catching up with a friend",
        emoji: "💬",
        role: "You are chatting with a Filipino friend you haven't seen in a while.",
        wants: [
          "Say how you are",
          "Talk about the weather",
          "Tell your friend what you did yesterday",
          "Share your plan for tomorrow",
          "Say yes to your friend's invitation",
        ],
        facts: [
          "You feel good",
          "It's hot today",
          "Yesterday you studied",
          "Tomorrow you're going to the mall",
        ],
        steps: [
          {
            prompt: "Kumusta ka?",
            translation: "How are you?",
            answers: ["Mabuti ako", "Mabuti naman ako", "Okay lang ako"],
            hint: "Mabuti ako.",
            hintTranslation: "I'm good.",
            distractors: ["kumusta", "ka"],
          },
          {
            prompt: "Kumusta ang panahon?",
            translation: "How's the weather?",
            answers: ["Mainit ngayon", "Mainit"],
            hint: "Mainit ngayon.",
            hintTranslation: "It's hot today.",
            distractors: ["maulan", "bukas"],
            mistakes: [
              { contains: "maulan", feedback: "Check your scenario: it's hot today (mainit)." },
            ],
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
            mistakes: [
              { contains: "hindi", feedback: "Check your scenario: you want to say yes to the invitation." },
            ],
          },
        ],
      },
    ],
  },
];

export function getLesson(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}