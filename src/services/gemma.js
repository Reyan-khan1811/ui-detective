export async function analyzeUI(imageBase64, mimeType) {
  const response = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "UI analysis failed");
  }

  return data.analysis;
}