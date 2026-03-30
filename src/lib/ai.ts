import Groq from "groq-sdk";
import { z } from "zod";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const issueSchema = z.object({
  severity: z.enum(["critical", "warning", "good"]),
  category: z.string(),
  message: z.string(),
  lineStart: z.number().optional(),
  lineEnd: z.number().optional(),
});

const analysisSchema = z.object({
  score: z.number().min(0).max(10),
  overallFeedback: z.string(),
  roastQuote: z.string().optional(),
  issues: z.array(issueSchema),
  suggestedFix: z.string().optional(),
});

type Analysis = z.infer<typeof analysisSchema>;

export async function analyzeCode(input: {
  code: string;
  language: string;
  roastMode: boolean;
}): Promise<Analysis> {
  const systemPrompt = input.roastMode
    ? `You are a brutally honest code reviewer. Analyze the provided code and give it a roast score from 0-10 (0 being the worst code ever, 10 being perfect). Include a sarcastic roast quote. Be harsh but constructive.`
    : `You are a professional code reviewer. Analyze the provided code and give it a score from 0-10. Provide detailed feedback on issues and improvements.`;

  const chatCompletion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2048,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Language: ${input.language}\n\nCode:\n\`\`\`\n${input.code}\n\`\`\`\n\nProvide analysis in JSON format matching this structure:
{
  "score": <number 0-10>,
  "overallFeedback": "<detailed feedback>",
  "roastQuote": "<sarcastic quote if roast mode>",
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "category": "<category name>",
      "message": "<detailed message>",
      "lineStart": <optional line number>,
      "lineEnd": <optional line number>
    }
  ],
  "suggestedFix": "<COMPLETE corrected code, NOT an explanation. Provide the full fixed code that should replace the original.>"
}`,
      },
    ],
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq");
  }

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return analysisSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to parse code analysis from AI");
  }
}
