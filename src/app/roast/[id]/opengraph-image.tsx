import { ImageResponse } from "takumi-js/response";
import { getSubmissionWithAnalysis } from "@/db/queries/leaderboard";

export const runtime = "nodejs";

export const alt = "DevRoast - Code Roast Result";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ id: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { id } = await params;
  const submission = await getSubmissionWithAnalysis(id);

  if (!submission) {
    return new ImageResponse(
      <div
        style={{
          background: "#0C0C0C",
          borderWidth: 1,
          borderColor: "#1F1F1F",
          color: "#FAFAFA",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 32,
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        DevRoast - Not Found
      </div>,
      { ...size },
    );
  }

  const getVerdict = (score: number): { text: string; color: string } => {
    if (score >= 7) return { text: "excellent_code", color: "#10b981" };
    if (score >= 4) return { text: "needs_improvement", color: "#f59e0b" };
    return { text: "needs_serious_help", color: "#ef4444" };
  };

  const verdict = getVerdict(submission.score);
  const langInfo = `${submission.language} · ${submission.code.split("\n").length} lines`;
  const roastQuoteDisplay =
    submission.roastQuote || submission.overallFeedback.slice(0, 100);

  return new ImageResponse(
    <div
      style={{
        background: "#0C0C0C",
        borderWidth: 1,
        borderColor: "#1F1F1F",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        gap: 28,
      }}
    >
      {/* Logo Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            color: "#10B981",
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          &gt;
        </span>
        <span
          style={{
            color: "#FAFAFA",
            fontSize: 20,
            fontWeight: 500,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          devroast
        </span>
      </div>

      {/* Score Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          style={{
            color: verdict.color,
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {submission.score.toFixed(1)}
        </span>
        <span
          style={{
            color: "#4B5563",
            fontSize: 56,
            fontWeight: 400,
            lineHeight: 1,
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: 16,
          }}
        >
          /10
        </span>
      </div>

      {/* Verdict Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            background: verdict.color,
            width: 12,
            height: 12,
            borderRadius: 6,
          }}
        />
        <span
          style={{
            color: verdict.color,
            fontSize: 20,
            fontWeight: 400,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          verdict: {verdict.text}
        </span>
      </div>

      {/* Lang Info */}
      <span
        style={{
          color: "#4B5563",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {langInfo}
      </span>

      {/* Roast Quote */}
      <span
        style={{
          color: "#FAFAFA",
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.5,
          textAlign: "center",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        "{roastQuoteDisplay}"
      </span>
    </div>,
    { ...size },
  );
}
