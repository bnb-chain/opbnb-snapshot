import { renderTemplate } from "./auto_update.ts";

function assertEquals(actual: unknown, expected: unknown): void {
  if (actual !== expected) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

Deno.test("renders nested values", () => {
  const result = renderTemplate(
    "URL: {{ snapshot.url }}\nSHA: {{snapshot.sha256}}",
    {
      snapshot: {
        url: "https://example.com/snapshot.tar.gz",
        sha256: "abc123",
      },
    },
  );

  assertEquals(
    result,
    "URL: https://example.com/snapshot.tar.gz\nSHA: abc123",
  );
});

Deno.test("renders missing values as empty strings", () => {
  assertEquals(
    renderTemplate("URL: {{snapshot.url}}", { snapshot: "" }),
    "URL: ",
  );
});
