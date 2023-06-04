export default function encodeNewLineAndQuote(text: string): string {
  return text.replaceAll("'", "%27").replaceAll("\n", "%0A");
}
