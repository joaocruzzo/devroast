import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { ToggleDemo } from "@/components/ui/toggle-demo";

const buttonVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const buttonSizes = ["default", "sm", "lg", "icon"] as const;

const badgeVariants = ["critical", "warning", "good", "verdict"] as const;

const codeExample = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page p-8">
      <h1 className="mb-8 font-mono text-3xl font-bold">UI Components</h1>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Button</h2>

        <div className="mb-8">
          <h3 className="mb-4 font-mono text-lg font-medium">Variants</h3>
          <div className="flex flex-wrap gap-4">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-lg font-medium">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            {buttonSizes.map((size) => (
              <Button key={size} size={size}>
                {size === "icon" ? "Icon" : size}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Badge</h2>
        <div className="flex flex-wrap gap-6">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Toggle</h2>
        <ToggleDemo />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Card</h2>
        <Card>
          <CardHeader>
            <Badge variant="critical">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              critical
            </Badge>
          </CardHeader>
          <CardTitle>using var instead of const/let</CardTitle>
          <CardDescription>
            the var keyword is function-scoped rather than block-scoped, which
            can lead to unexpected behavior and bugs. modern javascript uses
            const for immutable bindings and let for mutable ones.
          </CardDescription>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Code Block</h2>
        <CodeBlock code={codeExample} language="javascript" theme="vesper" />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Diff Line</h2>
        <div className="flex flex-col border border-border-primary rounded-md overflow-hidden max-w-xl">
          <DiffLine variant="removed" prefix="-">
            var total = 0;
          </DiffLine>
          <DiffLine variant="added" prefix="+">
            const total = 0;
          </DiffLine>
          <DiffLine variant="context" prefix=" ">
            for (let i = 0; i &lt; items.length; i++) {"{"}
          </DiffLine>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-2xl font-semibold">Score Ring</h2>
        <div className="flex gap-8">
          <ScoreRing score={3.5} />
          <ScoreRing score={7.5} />
          <ScoreRing score={1.2} />
        </div>
      </section>
    </div>
  );
}
