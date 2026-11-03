import { NextResponse } from "next/server";

// If a model name stops working, check AI Studio for the current free Flash model.
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const FALLBACK = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-flash-latest";

const SYSTEM = `You are Tambay, a friendly neighborhood "tambay" (the guy who hangs out at the corner or sari-sari store) and the mascot of a Filipino language app. The learner is a heritage speaker or beginner of Filipino/Tagalog. They are on a video call with you and have shared a photo, and then they reply to you.

Rules:
- Speak simple, natural Tagalog at a beginner level: 1-2 short sentences. A little Taglish is fine. You are a warm, casual tropa.
- React to what is actually in the photo. If it is food, say what it is and, in culture_note, mention a similar Filipino dish or how Filipinos would eat or talk about it. If you are unsure what something is, say so instead of guessing confidently.
- Never identify real people from their faces. Talk about what they are doing or wearing instead.
- If the photo is inappropriate or unclear, react playfully in character and ask them to share something else.
- If the learner replies in Tagalog, gently recast any mistakes by saying the correct version naturally in your reply, without lecturing. If they reply in English, answer in simple Tagalog and encourage them to try Tagalog.
- Always end with one easy follow-up question.

Return ONLY valid JSON in exactly this shape:
{
  "seen": "short English description of the photo (repeat it every turn)",
  "tagalog": "your reply in Tagalog",
  "english": "English translation of your reply",
  "vocab": [{"word": "...", "meaning": "..."}],
  "culture_note": "one short English sentence, or null",
  "follow_up": {"tagalog": "...", "english": "..."},
  "suggested_replies": [{"tagalog": "...", "english": "..."}]
}
vocab has 2-4 useful words from your reply. suggested_replies has 2-3 easy beginner answers to your follow-up question.`;

// Very small in-memory rate limit (fine for a class project; resets when the server restarts).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

// Tries the main model, retrying when Google is overloaded, then falls back to a second model.
async function callGemini(key: string, payload: object): Promise<Response> {
  const models = [MODEL, FALLBACK];
  let last: Response | undefined;
  for (const model of models) {
    try {
      const res = await Promise.race([
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify(payload),
        }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 30_000)),
      ]);
      if (res === null) {
        console.error(`Gemini ${model} timed out after 30s`);
        continue;
      }
      // Success, or an error retrying won't fix (bad key, bad model name, quota).
      if (res.status !== 503 && res.status !== 500) return res;
      last = res;
    } catch (e) {
      console.error(`Gemini ${model} request failed:`, String(e));
    }
  }
  return last ?? new Response("{}", { status: 503 });
}

type Turn = { role: "user" | "model"; text: string };

async function handle(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server is missing GEMINI_API_KEY." }, { status: 500 });

  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many calls. Try again in a minute." }, { status: 429 });
  }

  let body: { image?: string; history?: Turn[]; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history : [];
  if (
    history.length > 20 ||
    history.some((t) => (t.role !== "user" && t.role !== "model") || typeof t.text !== "string" || t.text.length > 6000) ||
    (body.image && body.image.length > 2_000_000) ||
    (body.message && body.message.length > 300)
  ) {
    return NextResponse.json({ error: "Request too large." }, { status: 400 });
  }

  // First turn sends the photo. Later turns send text history only
  // (Tambay's earlier replies carry a "seen" description of the photo).
  const contents =
    history.length === 0 && body.image
      ? [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: "image/jpeg", data: body.image } },
              { text: "I'm sharing this photo on our call. Start the conversation." },
            ],
          },
        ]
      : [
          ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
          { role: "user", parts: [{ text: body.message ?? "" }] },
        ];

  const res = await callGemini(key, {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents,
    generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
  });

  if (!res.ok) {
    console.error("Gemini error", res.status, await res.text());
    const msg =
      res.status === 429
        ? "Tambay's phone is busy (free quota reached). Try again in a bit."
        : res.status === 503
          ? "Tambay's line is busy right now (Google is overloaded). Try again in a moment."
          : "Tambay couldn't pick up. Try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const data = await res.json();
  const text: string = (data.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");

  try {
    const reply = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json({ reply });
  } catch {
    console.error("Unparseable model output:", text);
    return NextResponse.json({ error: "Tambay mumbled something. Try again." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("tambay-call crashed:", e);
    return NextResponse.json({ error: "Tambay couldn't pick up. Try again." }, { status: 502 });
  }
}
