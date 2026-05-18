import { NextRequest, NextResponse } from "next/server";

const MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "qwen/qwen3-32b",
];

const SYSTEM_PROMPT =
  "You are generating EHAC module study notes. Output concise, factual prose in structured markdown.\n\n" +
  "FORMATTING RULES:\n" +
  "- Use ## for section headings, ### for subheadings, bullet points, tables, and ```code blocks.\n" +
  "- Use blockquotes for callout boxes: > **Key Point:**, > **Warning:**, > **Tip:**, > **Info:**, > **Danger:**.\n" +
  "- Write in third-person instructional style with beginner-friendly mental models.\n" +
  "- Use phrasing like 'Beginner mental model:', 'This matters in exams because:', 'A useful way to think about this is:'.\n" +
  "- Never refer to yourself as an AI. Never use emojis or decorative formatting.\n\n" +
  "CRITICAL — OUTPUT MUST BE STUDY NOTES, NOT AN ANSWER SHEET:\n\n" +
  "WRONG (do not output this style):\n" +
  "\"\"\"\n" +
  "(a) Event 4648 indicates a logon with explicit credentials. It is significant in this context because...\n" +
  "(b) Two possible causes for the gap are log wrapping and log deletion...\n" +
  "(c) Logon Type 3 represents a network logon...\n" +
  "\"\"\"\n\n" +
  "CORRECT (output this style):\n" +
  "\"\"\"\n" +
  "### Credential Use Events (Event 4648)\n" +
  "Event 4648 records a logon where explicit credentials were provided separately from the current user context. This event appears when a user runs a program with alternate credentials (Run As) or when tools like PsExec supply credentials.\n\n" +
  "### Event Log Retention and Gaps\n" +
  "Event logs on domain-joined machines default to 7-day retention. Once the maximum size is reached, the oldest events are overwritten. A gap in Security.evtx may indicate log wrapping...\n\n" +
  "### Logon Types (Event 4624)\n" +
  "Every Event 4624 carries a Logon Type code. Type 3 (Network) occurs when accessing a remote resource such as a file share...\n" +
  "\"\"\"\n\n" +
  "RULES:\n" +
  "1. NEVER use question numbering: no (a), (b), (c), (d), no Q1, Part A, or any exam-question structure.\n" +
  "2. NEVER use phrases like 'in this context', 'in this scenario', 'in this case', 'the answer is', 'in response to your question', 'here are the key points', 'this suggests that', 'this is significant because'.\n" +
  "3. NEVER refer to any input as a question. Treat it as a topic request for notes.\n" +
  "4. Organise by topic headings, not by question parts. Cover each concept under its own heading.\n" +
  "5. Weave all facts into explanatory prose as if written for a textbook section.\n" +
  "6. The output must look like it was copied from a set of revision notes — it must NOT look like an answer sheet.";

async function tryModel(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[]
): Promise<{ ok: true; content: string } | { ok: false; retryable: boolean }> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      if (content) return { ok: true, content };
      return { ok: false, retryable: false };
    }

    const status = response.status;
    const body = await response.text().catch(() => "");
    const retryable =
      status === 429 ||
      status === 503 ||
      status === 502 ||
      body.toLowerCase().includes("rate limit") ||
      body.toLowerCase().includes("quota") ||
      body.toLowerCase().includes("too many requests") ||
      body.toLowerCase().includes("try again");

    console.warn(`Model ${model} failed (${status}): retryable=${retryable}`);
    return { ok: false, retryable };
  } catch (e) {
    console.warn(`Model ${model} threw:`, e);
    return { ok: false, retryable: true };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, modelIndex = 0 } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const startIndex = Math.max(0, Math.min(typeof modelIndex === "number" ? modelIndex : 0, MODELS.length - 1));

    for (let i = startIndex; i < MODELS.length; i++) {
      const model = MODELS[i];
      const result = await tryModel(apiKey, model, messages);

      if (result.ok) {
        return NextResponse.json({ content: result.content, model, modelIndex: i });
      }

      if (!result.retryable) {
        return NextResponse.json({ error: `Model ${model} rejected the request` }, { status: 502 });
      }
    }

    return NextResponse.json({
      error: `All ${MODELS.length} models exhausted (rate limited or unavailable)`,
    }, { status: 429 });
  } catch (e) {
    console.error("AI ask error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
