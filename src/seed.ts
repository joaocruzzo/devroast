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
      `function getUserData(id) {
  eval("var user = db.find(" + id + ")");
  document.write(user);
  eval("localStorage.setItem('token', user.password)");
  return user;
}`,
      `const processData = async (input) => {
  var result = [];
  for (var i = 0; i < input.length; i++) {
    var item = input[i];
    await fetch('/api/process', { body: JSON.stringify(item) });
    result.push(item);
  }
  return result;
};`,
      `function checkAdmin(user) {
  if (user.role = "admin") {
    console.log("Access granted");
    window.location = "/admin";
  }
}`,
    ],
    typescript: [
      `function calculate(items: any[]): string {
  let total: any = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].value;
  }
  return total;
}`,
      `async function fetchUser(id: any) {
  const response = await fetch('/api/user/' + id);
  const data = response.json();
  return data;
}`,
    ],
    python: [
      `def get_user(user_id):
    query = "SELECT * FROM users WHERE id = " + str(user_id)
    cursor.execute(query)
    result = cursor.fetchall()
    exec("print('User:', result)")
    return result`,
      `def process_items(items):
    for item in items:
        exec("result = item * 2")
        requests.post('/api/save', data=item)
    return True`,
    ],
    rust: [
      `fn process_data(data: &str) -> String {
    let mut result = String::new();
    for i in 0..1000 {
        result.push_str(data);
    }
    result
}`,
    ],
    go: [
      `func handler(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query()["id"][0]
    query := "SELECT * FROM users WHERE id = " + id
    row := db.QueryRow(query)
    var user User
    row.Scan(&user)
    json.NewEncoder(w).Encode(user)
}`,
    ],
    java: [
      `public String getData(String id) {
    String query = "SELECT * FROM data WHERE id = " + id;
    Statement stmt = conn.createStatement();
    ResultSet rs = stmt.executeQuery(query);
    rs.next();
    return rs.getString("value");
}`,
    ],
    csharp: [
      `public IActionResult GetUser(string id) {
    var query = "SELECT * FROM Users WHERE Id = " + id;
    var result = _context.Database.ExecuteSqlRaw(query);
    return Ok(result);
}`,
    ],
    cpp: [
      `void process(char* input) {
    char buffer[64];
    strcpy(buffer, input);
    printf(buffer);
}`,
    ],
    sql: [
      `SELECT u.id, u.name, u.password, u.secret_token
FROM users u
JOIN admin a ON a.user_id = u.id
WHERE 1=1`,
      `SELECT * FROM products, orders, customers, inventory
WHERE products.id = orders.product_id
AND customers.id = orders.customer_id`,
      `DELETE FROM users WHERE id = ` +
        faker.string.numeric(5) +
        `
AND status = 'active'`,
    ],
    html: [
      `<div class="container">
  <script>eval(userInput)</script>
  <img src="x" onerror="fetch('/hack?c='+document.cookie)">
  <div style="background: expression(alert('xss'))">
</div>`,
    ],
    css: [
      `.parent .child .subchild .deep .nested .class {
  color: red !important;
  font-size: 999999px;
  margin: -100px;
}`,
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

function generateFixedCode(
  code: string,
  language: string,
): { originalCode: string; fullCode: string } {
  const lines = code.split("\n");
  const fixedLines = [...lines];

  if (language === "javascript" || language === "typescript") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes("eval(")) {
        fixedLines[i] = fixedLines[i].replace(
          /eval\(/g,
          "/* eslint-disable no-eval */ (0, Function)(",
        );
      }
      if (fixedLines[i].includes("var ") && !fixedLines[i].includes("var ")) {
        fixedLines[i] = fixedLines[i].replace(/\bvar\b/g, "const");
      }
      if (fixedLines[i].includes("document.write")) {
        fixedLines[i] = fixedLines[i].replace(
          "document.write",
          "// Use DOM manipulation instead",
        );
      }
      if (fixedLines[i].includes("localStorage.setItem")) {
        fixedLines[i] =
          "// " +
          fixedLines[i].replace(
            "localStorage.setItem",
            "Consider encrypting before storing",
          );
      }
      if (fixedLines[i].includes("window.location")) {
        fixedLines[i] =
          "// " + fixedLines[i] + " // Use history.pushState instead";
      }
      if (fixedLines[i].includes(": any")) {
        fixedLines[i] = fixedLines[i].replace(": any", ": unknown");
      }
      if (
        fixedLines[i].includes("await fetch") &&
        fixedLines[i].includes(".json()")
      ) {
        fixedLines[i] = fixedLines[i].replace(".json()", ".json() as YourType");
      }
    }
  } else if (language === "python") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes("exec(")) {
        fixedLines[i] =
          "# " + fixedLines[i] + " // Use ast.literal_eval instead";
      }
      if (fixedLines[i].includes("cursor.execute")) {
        fixedLines[i] = fixedLines[i].replace(
          "cursor.execute",
          "# Use parameterized queries: cursor.execute",
        );
      }
      if (fixedLines[i].includes("requests.post")) {
        fixedLines[i] = fixedLines[i].replace(
          "requests.post",
          "# Use session.post with timeout: requests.post",
        );
      }
    }
  } else if (language === "rust") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes("String::new()")) {
        fixedLines[i] = fixedLines[i].replace(
          "String::new()",
          "String::with_capacity(size_hint)",
        );
      }
      if (
        fixedLines[i].includes("push_str(") &&
        i > 0 &&
        fixedLines[i - 1].includes("for")
      ) {
        fixedLines[i] = "// Consider using iterator: " + fixedLines[i];
      }
    }
  } else if (language === "go") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (
        fixedLines[i].includes("db.QueryRow") &&
        fixedLines[i].includes("+ id")
      ) {
        fixedLines[i] = fixedLines[i].replace("+ id", '+ "?"');
      }
      if (fixedLines[i].includes("json.NewEncoder")) {
        fixedLines[i] = "// Add error handling: " + fixedLines[i];
      }
    }
  } else if (language === "java" || language === "csharp") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (
        fixedLines[i].includes("Statement") &&
        fixedLines[i].includes("executeQuery")
      ) {
        fixedLines[i] = "// Use PreparedStatement: " + fixedLines[i];
      }
      if (
        fixedLines[i].includes("ExecuteSqlRaw") ||
        fixedLines[i].includes("executeSqlRaw")
      ) {
        fixedLines[i] = "// Use parameterized queries: " + fixedLines[i];
      }
    }
  } else if (language === "cpp") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes("strcpy")) {
        fixedLines[i] = "// Use strncpy or std::string: " + fixedLines[i];
      }
      if (fixedLines[i].includes("printf(") && !fixedLines[i].includes("%")) {
        fixedLines[i] = "// Sanitize input: " + fixedLines[i];
      }
    }
  } else if (language === "html") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (
        fixedLines[i].includes("eval(") ||
        fixedLines[i].includes("onerror")
      ) {
        fixedLines[i] = "<!-- " + fixedLines[i] + " -->";
      }
      if (fixedLines[i].includes("expression(")) {
        fixedLines[i] = "/* " + fixedLines[i] + " */";
      }
    }
  } else if (language === "css") {
    for (let i = 0; i < fixedLines.length; i++) {
      if (fixedLines[i].includes("!important")) {
        fixedLines[i] =
          "/* Remove !important: */ " + fixedLines[i].replace("!important", "");
      }
      if (parseInt(fixedLines[i].match(/\d+/)?.[0] || "0") > 100) {
        fixedLines[i] = "/* Reasonable value: */ " + fixedLines[i];
      }
    }
  }

  const originalCode = lines.join("\n");
  const fullCode = fixedLines.join("\n");

  return { originalCode, fullCode };
}

async function seed() {
  console.log("🌱 Starting seed...");

  const totalToInsert = 20;
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

      if (severity !== "good") {
        const { originalCode, fullCode } = generateFixedCode(code, language);
        await db.insert(suggestedFixes).values({
          issueId: issue.id,
          originalCode,
          fullCode,
          diffJson: "",
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
