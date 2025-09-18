export function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "i");
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? <strong key={idx}>{part}</strong> : part
  );
}
