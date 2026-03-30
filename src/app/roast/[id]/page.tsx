import Link from "next/link";
import { RoastContent } from "@/components/roast-content";
import { getSubmissionWithAnalysis } from "@/db/queries/leaderboard";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const submission = await getSubmissionWithAnalysis(id);

  if (!submission) {
    return { title: "devroast - not found" };
  }

  return {
    title: `devroast - score: ${submission.score}/10`,
    description: submission.overallFeedback.slice(0, 150),
    openGraph: {
      title: `devroast - score: ${submission.score}/10`,
      description: submission.overallFeedback.slice(0, 150),
      type: "website",
      images: [
        {
          url: `/roast/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "DevRoast Code Roast Result",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `devroast - score: ${submission.score}/10`,
      description: submission.overallFeedback.slice(0, 150),
      images: [`/roast/${id}/opengraph-image`],
    },
  };
}

export default async function RoastResultPage({ params }: PageProps) {
  const { id } = await params;
  const submission = await getSubmissionWithAnalysis(id);

  if (!submission) {
    return (
      <main className="flex flex-col gap-10 px-20 py-10">
        <div className="text-center py-10 text-accent-red">
          Submission not found
        </div>
        <Link
          href="/"
          className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {"< back to home"}
        </Link>
      </main>
    );
  }

  return <RoastContent submission={submission} />;
}
