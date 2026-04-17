export default async function handler(req, res) {
  const { q, destination } = req.query;

  if (!q || !destination) {
    return res.status(400).json({ error: "Missing q or destination" });
  }

  const key = process.env.GOOGLE_PLACES_KEY;
  if (!key) {
    return res.status(500).json({ error: "Google Places key not configured" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + " " + destination)}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Google Places" });
  }
}
