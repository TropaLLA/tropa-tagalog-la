export type VocabItem = {
  word: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  grammar?: string;
};
export type VocabSection = { heading: string; items: VocabItem[] };
export type VocabTheme = {
  slug: string;
  title: string;
  blurb: string;
  sections: VocabSection[];
};

export const VOCAB: VocabTheme[] = [
  {
    slug: "travel",
    title: "Travelling",
    blurb: "Directions, places, and small talk",
    sections: [
      {
        heading: "Asking directions",
        items: [
          {
            word: "Nasaan ang...?",
            meaning: "Where is...?",
            example: "Nasaan ang banyo?",
            exampleMeaning: "Where is the bathroom?",
            grammar: "Use “nasaan” to ask where a person or thing is. Use “saan” when there’s an action: “Saan ka pupunta?”",
          },
          {
            word: "Paano pumunta sa...?",
            meaning: "How do I get to...?",
            example: "Paano pumunta sa mall?",
            exampleMeaning: "How do I get to the mall?",
            grammar: "“paano” = how. “pumunta sa” = go to (a place).",
          },
          {
            word: "kanan",
            meaning: "right",
            example: "Nasa kanan ang mall.",
            exampleMeaning: "The mall is on the right.",
            grammar: "“Nasa” + a direction or place tells where something is.",
          },
          {
            word: "kaliwa",
            meaning: "left",
            example: "Kumaliwa ka sa kanto.",
            exampleMeaning: "Turn left at the corner.",
            grammar: "“kumaliwa” = turn left. The -um- goes after the first letter: k-um-aliwa.",
          },
          {
            word: "diretso",
            meaning: "straight ahead",
            example: "Diretso lang po.",
            exampleMeaning: "Just go straight.",
            grammar: "“lang” softens it to “just”. “po” makes it polite.",
          },
          {
            word: "malapit",
            meaning: "near",
            example: "Malapit lang ang istasyon.",
            exampleMeaning: "The station is close.",
            grammar: "The opposite is “malayo” (far).",
          },
        ],
      },
      {
        heading: "Places",
        items: [
          {
            word: "istasyon",
            meaning: "station",
            example: "Pupunta ako sa istasyon.",
            exampleMeaning: "I’m going to the station.",
            grammar: "“pupunta” = will go / going to go.",
          },
          {
            word: "banyo",
            meaning: "bathroom",
            example: "Nasa kaliwa ang banyo.",
            exampleMeaning: "The bathroom is on the left.",
          },
          {
            word: "mall",
            meaning: "mall",
            example: "Malayo ba ang mall?",
            exampleMeaning: "Is the mall far?",
          },
        ],
      },
      {
        heading: "Small talk",
        items: [
          {
            word: "Taga-saan ka?",
            meaning: "Where are you from?",
            example: "Taga-Maynila ako.",
            exampleMeaning: "I’m from Manila.",
            grammar: "“taga-” + a place means “from”.",
          },
          {
            word: "Bakit ka nandito?",
            meaning: "Why are you here?",
            example: "Nandito ako para mag-aral.",
            exampleMeaning: "I’m here to study.",
            grammar: "“para” + a verb means “in order to”.",
          },
          {
            word: "Nagbabakasyon ako.",
            meaning: "I’m on vacation.",
            example: "Nagbabakasyon ako rito.",
            exampleMeaning: "I’m on vacation here.",
            grammar: "“nag-” + a repeated first syllable shows something happening now: nag-ba-bakasyon.",
          },
        ],
      },
    ],
  },
  {
    slug: "restaurant",
    title: "Restaurants & Cafes",
    blurb: "Ordering and describing food",
    sections: [
      {
        heading: "Ordering",
        items: [
          {
            word: "Gusto ko ng...",
            meaning: "I would like...",
            example: "Gusto ko ng adobo.",
            exampleMeaning: "I would like adobo.",
            grammar: "Put “ng” between “gusto ko” and the thing you want.",
          },
          {
            word: "Puwede po bang umorder?",
            meaning: "May I order?",
            example: "Puwede po bang umorder ng kape?",
            exampleMeaning: "May I order a coffee?",
            grammar: "“puwede” = can/may. “po” makes it polite.",
          },
          {
            word: "Magkano ito?",
            meaning: "How much is this?",
            example: "Magkano ang adobo?",
            exampleMeaning: "How much is the adobo?",
            grammar: "“ito” = this. Swap in “ang” + a food name to ask about a specific dish.",
          },
          {
            word: "isang kape",
            meaning: "one coffee",
            example: "Isang kape po.",
            exampleMeaning: "One coffee, please.",
            grammar: "“isa” + “ng” becomes “isang” before a noun.",
          },
        ],
      },
      {
        heading: "Describing food",
        items: [
          {
            word: "Ano ang...?",
            meaning: "What is...?",
            example: "Ano ang sinigang?",
            exampleMeaning: "What is sinigang?",
            grammar: "“ano” = what. “ang” points to the specific thing you’re asking about.",
          },
          {
            word: "masarap",
            meaning: "delicious",
            example: "Masarap ang adobo.",
            exampleMeaning: "The adobo is delicious.",
            grammar: "Many describing words follow ma- + root: ma-sarap.",
          },
          {
            word: "maanghang",
            meaning: "spicy",
            example: "Maanghang ba ito?",
            exampleMeaning: "Is this spicy?",
            grammar: "ma- + anghang (spiciness). “ba” turns a sentence into a yes/no question.",
          },
          {
            word: "maasim",
            meaning: "sour",
            example: "Maasim ang sinigang.",
            exampleMeaning: "The sinigang is sour.",
          },
          {
            word: "matamis",
            meaning: "sweet",
            example: "Matamis ang halo-halo.",
            exampleMeaning: "The halo-halo is sweet.",
          },
          {
            word: "May karne ba ito?",
            meaning: "Does this have meat?",
            example: "May karne ba ang sinigang?",
            exampleMeaning: "Does the sinigang have meat?",
            grammar: "“may” = has/there is. “walang” = has no: walang karne.",
          },
        ],
      },
    ],
  },
  {
    slug: "daily",
    title: "Daily Conversation",
    blurb: "Feelings, plans, and slang",
    sections: [
      {
        heading: "Feelings",
        items: [
          {
            word: "Kumusta ka?",
            meaning: "How are you?",
            example: "Kumusta ka ngayon?",
            exampleMeaning: "How are you today?",
            grammar: "Answer with “Mabuti ako” (I’m good).",
          },
          {
            word: "masaya",
            meaning: "happy",
            example: "Masaya ako ngayon.",
            exampleMeaning: "I’m happy today.",
            grammar: "Describing word + “ako” = I am ....",
          },
          {
            word: "pagod",
            meaning: "tired",
            example: "Pagod ako ngayon.",
            exampleMeaning: "I’m tired today.",
          },
          {
            word: "gutom",
            meaning: "hungry",
            example: "Gutom na ako.",
            exampleMeaning: "I’m hungry now.",
            grammar: "“na” adds “already” or “now”.",
          },
        ],
      },
      {
        heading: "Plans",
        items: [
          {
            word: "Ano ang gagawin mo ngayon?",
            meaning: "What are you going to do today?",
            example: "Mag-aaral ako ngayon.",
            exampleMeaning: "I’m going to study today.",
            grammar: "“gagawin” = will do. The repeated first syllable (ga-gawin) marks the future.",
          },
          {
            word: "bukas",
            meaning: "tomorrow",
            example: "Pupunta ako sa mall bukas.",
            exampleMeaning: "I’m going to the mall tomorrow.",
            grammar: "Future time words like “bukas” go with future verbs: pupunta.",
          },
          {
            word: "kahapon",
            meaning: "yesterday",
            example: "Nag-aral ako kahapon.",
            exampleMeaning: "I studied yesterday.",
            grammar: "Past time words go with past verbs: nag-aral, not mag-aaral.",
          },
          {
            word: "Gusto mo bang sumama?",
            meaning: "Do you want to come along?",
            example: "Oo, sasama ako.",
            exampleMeaning: "Yes, I’ll come along.",
            grammar: "“sumama” = join/come along. “mo” + “ba” becomes “mo bang”.",
          },
        ],
      },
      {
        heading: "Slang",
        items: [
          {
            word: "Tara!",
            meaning: "Let’s go!",
            example: "Tara, kain tayo!",
            exampleMeaning: "Come on, let’s eat!",
            grammar: "Casual. Used with friends.",
          },
          {
            word: "Sige",
            meaning: "Okay / sure / go ahead",
            example: "Sige, mamaya.",
            exampleMeaning: "Okay, later.",
          },
          {
            word: "Lodi",
            meaning: "idol (someone you look up to)",
            example: "Lodi kita!",
            exampleMeaning: "You’re my idol!",
            grammar: "Slang from “idol” spelled backwards.",
          },
          {
            word: "Charot",
            meaning: "Just kidding",
            example: "Charot lang!",
            exampleMeaning: "Just kidding!",
          },
          {
            word: "Kilig",
            meaning: "the giddy, fluttery feeling of romantic excitement",
            example: "Kinilig ako!",
            exampleMeaning: "I got all giddy!",
            grammar: "“kinilig” is the past form of “kilig”.",
          },
        ],
      },
    ],
  },
];

export function getTheme(slug: string) {
  return VOCAB.find((t) => t.slug === slug);
}