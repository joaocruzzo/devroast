type RoastOgProps = {
  score: string;
  verdict: string;
  lang: string;
  lines: string;
  quote: string;
};

export function RoastOg({ score, verdict, lang, lines, quote }: RoastOgProps) {
  const scoreNum = parseFloat(score).toFixed(1);
  const lineCount = parseInt(lines, 10);

  const getVerdictColor = () => {
    if (verdict.includes("excellent")) return "#10B981";
    if (verdict.includes("improvement")) return "#F59E0B";
    return "#EF4444";
  };

  const formatVerdict = () => {
    return verdict.replace(/_/g, " ");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#0C0C0C",
        borderWidth: 1,
        borderColor: "#1F1F1F",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          flex: 1,
          padding: 64,
        }}
      >
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
              fontWeight: 700,
              fontSize: 24,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {">"}
          </span>
          <span
            style={{
              color: "#FAFAFA",
              fontWeight: 500,
              fontSize: 20,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            devroast
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: "#F59E0B",
              lineHeight: 1,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {scoreNum}
          </span>
          <span
            style={{
              fontSize: 56,
              color: "#4B5563",
              lineHeight: 1,
              marginBottom: 16,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            /10
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getVerdictColor(),
            }}
          />
          <span
            style={{
              fontSize: 20,
              color: getVerdictColor(),
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {formatVerdict()}
          </span>
        </div>

        <span
          style={{
            fontSize: 16,
            color: "#4B5563",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          lang: {lang} · {lineCount} lines
        </span>

        <span
          style={{
            fontSize: 22,
            color: "#FAFAFA",
            textAlign: "center",
            width: "100%",
            lineHeight: 1.5,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          "{quote}"
        </span>
      </div>
    </div>
  );
}
