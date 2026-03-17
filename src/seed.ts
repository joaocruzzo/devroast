import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./db/index";
import { analyses, issues, submissions, suggestedFixes } from "./db/schema";

const languages = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "sql",
  "html",
  "css",
] as const;

const severities = ["critical", "warning", "good"] as const;
const categories = [
  "security",
  "performance",
  "style",
  "best-practice",
  "error-handling",
  "naming",
  "complexity",
] as const;

const roastFeedbackTemplates = [
  "This code is a crime against humanity. I'm genuinely concerned about your employment.",
  "Oh sweet summer child, you have so much to learn...",
  "I've seen better code in a Hello World tutorial.",
  "This is why we can't have nice things.",
  "My grandmother codes better than this and she's been dead for 20 years.",
  "Please, for the love of all that is holy, refactor this.",
  "This is the coding equivalent of a parking fine.",
  "I'm not saying you're wrong, but I'm saying you're writing JavaScript like it's 1999.",
  "This code would fail a job interview at McDonald's.",
  "Congratulations, you've invented technical debt!",
];

const issueMessages: Record<string, string[]> = {
  security: [
    "Using eval() is like giving hackers a free buffet.",
    "SQL injection vulnerability detected. That's a paddlin'.",
    "Storing passwords in plain text? Bold strategy.",
    "No input validation. Expect a visit from the NSA.",
  ],
  performance: [
    "This loop is slower than my grandma's dial-up connection.",
    "You're fetching data inside a loop. Yikes!",
    "This is O(n²) when it could be O(n). Painful.",
    "Unnecessary re-renders on every keystroke.",
  ],
  style: [
    "Inconsistent indentation. Pick a side.",
    "Magic numbers everywhere! What do they mean?",
    "Variable named 'x'? Be more creative.",
    "This function does too many things. Split it up.",
  ],
  "best-practice": [
    "No error handling. Hope you like crashes.",
    "Missing type annotations. TypeScript weeps.",
    "No unit tests. This is fine. Everything is fine.",
    "Hardcoded values should be constants.",
  ],
  "error-handling": [
    "Swallowing errors with empty catch. Dangerous!",
    "No fallback for null values. Good luck!",
    "Ignoring Promise rejections. Time bomb.",
    "No try-catch around risky operations.",
  ],
  naming: [
    "Variable 'foo' is not descriptive. Try harder.",
    "Function name 'doStuff' tells me nothing.",
    "Class named 'Manager' - original, right?",
    "Constants should be UPPER_SNAKE_CASE.",
  ],
  complexity: [
    "This function is 200 lines. That's a red flag.",
    "Too many nested conditionals. Callback hell ahead.",
    "Cyclomatic complexity is through the roof.",
    "This file has 50 functions. That's too many.",
  ],
};

function generateCodeSnippet(language: (typeof languages)[number]): string {
  const snippets: Record<string, string[]> = {
    javascript: [
      "function foo() { eval(userInput); }",
      "var x = 1; var x = 2; console.log(x);",
      "for (var i = 0; i < 1000; i++) { fetch('/api/' + i); }",
      "if (user.isAdmin = true) { grantAccess(); }",
      "const arr = []; arr[99999] = 'x';",
    ],
    typescript: [
      "const x: any = 'hello'; x.foo.bar();",
      "function add(a: number, b: number): string { return a + b; }",
      "interface User { name: string; } const user = {} as User;",
      "type Foo = string | number; const x: Foo = {};",
      "async function getData() { return fetch('/api'); }",
    ],
    python: [
      "exec(user_input)",
      "def foo(x): return x + 1",
      "import pickle; data = pickle.loads(request.data)",
      "for i in range(1000): requests.get(f'/api/{i}')",
      "x = 1; x = 'one'; print(x)",
    ],
    rust: [
      "unsafe { *ptr.offset(1000); }",
      'let mut x = 1; let x = 2; println!("{}", x);',
      'fn foo() -> i32 { return "hello".to_string(); }',
      "loop { }",
      "unsafe impl Send for Foo {}",
    ],
    go: [
      "func foo() error { return nil }",
      'var m map[string]int; m["key"] = 1',
      "go func() { }()",
      "select {}",
      'defer panic("oh no")',
    ],
    java: [
      'String x = "1"; int y = Integer.parseInt(x);',
      "for (int i = 0; i < list.size(); i++) { list.get(i); }",
      "public static void main(String args[]) { }",
      "catch (Exception e) { }",
      "new Thread(new Runnable() { }).start();",
    ],
    csharp: [
      "var x = 1; var x = 2;",
      "foreach (var item in collection) { await db.SaveAsync(item); }",
      "public class Foo { public Foo() { new Foo(); } }",
      "try { } catch (Exception) { }",
      'var dynamic x = "hello"; x.foo();',
    ],
    cpp: [
      "int* p = nullptr; p[100] = 5;",
      "for (int i = 0; i < 1000000; i++) new char[1000];",
      "#define PI 3.14",
      "using namespace std;",
      "char* str = \"hello\"; str[0] = 'H';",
    ],
    sql: [
      "SELECT * FROM users WHERE 1=1",
      "SELECT * FROM users WHERE id = " + faker.string.numeric(5),
      "INSERT INTO users VALUES (1, 'admin', 'password123')",
      "DELETE FROM users -- oops",
      "SELECT * FROM orders, products, customers WHERE 1=1",
    ],
    html: [
      "<div></div><div></div><div></div><div></div><div></div>",
      "<script>eval(userInput)</script>",
      '<img src="broken.png" onerror="alert(1)">',
      '<div style="font-size: 1px"></div>',
      '<a href="javascript:void(0)">click me</a>',
    ],
    css: [
      ".foo { color: red; color: blue; }",
      ".container div div div div { }",
      "body { margin: -100px; }",
      "* { !important; }",
      ".class { font-size: 999999px; }",
    ],
  };

  const pool = snippets[language] || snippets.javascript;
  return faker.helpers.arrayElement(pool);
}

function generateIssueMessage(severity: (typeof severities)[number]) {
  const category = faker.helpers.arrayElement(categories);
  const messages = issueMessages[category] || ["This code needs improvement."];
  return {
    category,
    message: faker.helpers.arrayElement(messages),
    severity,
  };
}

async function seed() {
  console.log("🌱 Starting seed...");

  const totalToInsert = 100;
  let inserted = 0;

  for (let i = 0; i < totalToInsert; i++) {
    const language = faker.helpers.arrayElement(languages);
    const code = generateCodeSnippet(language);
    const roastMode = faker.datatype.boolean();
    const score = Number(
      faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    );

    const [submission] = await db
      .insert(submissions)
      .values({
        code,
        language,
        roastMode,
        ipHash: faker.string.alphanumeric(16),
      })
      .returning();

    const feedback = roastMode
      ? faker.helpers.arrayElement(roastFeedbackTemplates)
      : faker.lorem.paragraph();

    const [analysis] = await db
      .insert(analyses)
      .values({
        submissionId: submission.id,
        score,
        overallFeedback: feedback,
      })
      .returning();

    const numIssues = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < numIssues; j++) {
      const severity = faker.helpers.arrayElement(severities);
      const { category, message } = generateIssueMessage(severity);

      const [issue] = await db
        .insert(issues)
        .values({
          analysisId: analysis.id,
          severity,
          category,
          message,
          lineStart: faker.number.int({ min: 1, max: 20 }),
          lineEnd: faker.number.int({ min: 1, max: 20 }),
        })
        .returning();

      if (severity !== "good" && faker.datatype.boolean()) {
        await db.insert(suggestedFixes).values({
          issueId: issue.id,
          originalCode: code.split("\n")[0] || code,
          fixedCode: code.split("\n")[0]?.replace(/bad/g, "good") || code,
          explanation: faker.lorem.sentence(),
        });
      }
    }

    inserted++;
    if (inserted % 10 === 0) {
      console.log(`  ✅ Inserted ${inserted}/${totalToInsert} roasts...`);
    }
  }

  console.log(`🎉 Seed complete! ${inserted} roasts created.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
