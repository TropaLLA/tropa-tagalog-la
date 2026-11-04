export type Rating = "best" | "ok" | "miss";

export type Choice = {
  /** What the player says, in Tagalog. Optional because some choices are actions. */
  say?: string;
  /** English description of the action or the translation of `say`. */
  text: string;
  rating: Rating;
  /** Tambay's explanation, shown after the player picks. */
  why: string;
};

export type Situation = {
  id: string;
  emoji: string;
  place: string;
  setup: string;
  /** Something another person says in the scene. */
  line?: { tagalog: string; english: string };
  choices: Choice[];
  /** One-sentence takeaway shown in the final recap. */
  norm: string;
};

export const POINTS: Record<Rating, number> = { best: 2, ok: 1, miss: 0 };

export const SITUATIONS: Situation[] = [
  {
    id: "mano",
    emoji: "👵",
    place: "Sa bahay ni Lola",
    setup: "You arrive at your Lola's house for a family gathering. She's sitting in the living room.",
    choices: [
      {
        text: "Walk over and say hi with a big hug.",
        rating: "ok",
        why: "Warm, and Lola will probably love it. But the traditional greeting for an elder comes first: mano.",
      },
      {
        say: "Mano po, Lola.",
        text: "Take her hand and press the back of it to your forehead.",
        rating: "best",
        why: "That's pagmamano, a gesture of respect where you ask for an elder's blessing. The po keeps your words respectful too.",
      },
      {
        text: "Wave from across the room and go find the food.",
        rating: "miss",
        why: "Skipping the greeting can come across as disrespectful. Elders usually expect you to come to them first.",
      },
    ],
    norm: "Greet elders with mano po: take their hand, bring it to your forehead, and say \"Mano po.\"",
  },
  {
    id: "tao-po",
    emoji: "🚪",
    place: "Sa gate",
    setup: "You've arrived at your tita's house. The gate is closed and you can't see anyone inside.",
    choices: [
      {
        text: "Open the gate and walk in.",
        rating: "miss",
        why: "Most people would rather you announce yourself before coming in, even if you're family.",
      },
      {
        text: "Text them: \"I'm outside.\"",
        rating: "ok",
        why: "That works, and it's common now. But calling out is still the classic way, especially if nobody is looking at their phone.",
      },
      {
        say: "Tao po!",
        text: "Call out from the gate.",
        rating: "best",
        why: "Tao means person, so it's like saying \"a person is here,\" and po keeps it respectful. Someone will usually answer \"Tuloy po kayo!\" (please come in).",
      },
    ],
    norm: "Announce yourself at someone's gate or door by calling \"Tao po!\" before you go in.",
  },
  {
    id: "food",
    emoji: "🍛",
    place: "Sa handaan",
    setup: "Tita Lita puts a plate in front of you. You just ate.",
    line: { tagalog: "Kain ka pa!", english: "Eat some more!" },
    choices: [
      {
        say: "Ayoko niyan.",
        text: "Tell her you don't want it.",
        rating: "miss",
        why: "Turning down food bluntly can feel like turning down her care. In many Filipino homes, food is how people show love.",
      },
      {
        say: "Busog pa po ako, pero salamat po!",
        text: "Politely say you're still full, but thank her.",
        rating: "ok",
        why: "Polite and kind, but hosts often insist more than once, so don't be surprised by another offer.",
      },
      {
        say: "Sige po, kaunti lang po. Salamat po!",
        text: "Accept a small portion.",
        rating: "best",
        why: "Taking even a little honors her hospitality. If you truly can't eat, you can ask to take it home (pabalot).",
      },
    ],
    norm: "Food is love. Accept at least a little, and if you can't eat it, a polite thank-you or taking it home (pabalot) goes a long way.",
  },
  {
    id: "kuya",
    emoji: "👨",
    place: "Sa pamilya",
    setup: "Your older cousin Ben is helping carry the groceries inside. You need to ask him something.",
    choices: [
      {
        say: "Ben, pwede magtanong?",
        text: "Call him by his first name and ask.",
        rating: "ok",
        why: "That works with a peer. For an older cousin, Filipinos usually add Kuya (older brother) or Ate (older sister).",
      },
      {
        say: "Hoy, ano 'yan?",
        text: "Shout \"Hoy!\" to get his attention.",
        rating: "miss",
        why: "Hoy is for calling out to a peer, or someone you're annoyed with. It's too casual for an older relative.",
      },
      {
        say: "Kuya, pwede po bang magtanong?",
        text: "Call him Kuya and ask politely.",
        rating: "best",
        why: "Kuya is for older brothers and older male cousins or friends. Adding po makes it extra respectful.",
      },
    ],
    norm: "Use Kuya or Ate for older siblings, cousins, and friends, and keep the po when you speak to them.",
  },
  {
    id: "opo",
    emoji: "👴",
    place: "Kay Lolo",
    setup: "Lolo looks up from his newspaper and speaks to you. You've already eaten.",
    line: { tagalog: "Kumain ka na?", english: "Have you eaten yet?" },
    choices: [
      {
        say: "Oo.",
        text: "Answer with a plain yes.",
        rating: "miss",
        why: "A bare oo is fine with friends, but to an elder the respectful yes is opo.",
      },
      {
        text: "Just nod and smile.",
        rating: "ok",
        why: "Friendly, but elders usually expect a spoken answer, and that's your chance to use opo and po.",
      },
      {
        say: "Opo, kumain na po ako.",
        text: "Answer with opo, and keep the po in your sentence.",
        rating: "best",
        why: "Opo is the respectful yes. By the way, \"Kumain ka na?\" is also a way of saying \"I care about you.\"",
      },
    ],
    norm: "Say opo, not oo, to elders, and keep po in your sentences. \"Kumain ka na?\" is often a sign of care.",
  },
  {
    id: "pasalubong",
    emoji: "🧳",
    place: "Pag-uwi",
    setup: "You're back from a trip and about to visit your relatives.",
    choices: [
      {
        text: "Show up empty-handed. You'll share stories instead.",
        rating: "ok",
        why: "Your visit means a lot, but it's a loved tradition to bring something home from your trip.",
      },
      {
        text: "Bring one big, expensive gift for only Lola.",
        rating: "ok",
        why: "Generous, but pasalubong is usually small gifts for everyone, so nobody is left out.",
      },
      {
        say: "May pasalubong ako para sa inyo!",
        text: "Hand out small gifts, like snacks or souvenirs, for everyone.",
        rating: "best",
        why: "Pasalubong is a gift from your trip. It doesn't need to be expensive, because it shows you thought of them while you were away.",
      },
    ],
    norm: "Bring pasalubong, small gifts from your trip, for the family when you come back.",
  },
];
