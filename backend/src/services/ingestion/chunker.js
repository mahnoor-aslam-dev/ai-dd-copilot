function chunkText(text, chunkSize = 1000, overlap = 100) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start += chunkSize - overlap;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

module.exports = { chunkText };