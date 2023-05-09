export default function preserveNewLine(text: string): string {
  return text.replaceAll("\n", "%0A");
}
