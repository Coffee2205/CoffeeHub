export function normalizeMultilineText(input: string) {
  return input.replace(/\\r\\n|\\n|\\r/g, "\n");
}
