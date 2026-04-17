export default async function handler(req, res) {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({ error: "Missing destination" });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return res.status(500).json({ error: "Unsplash key not configured" });
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&orientation=landscape&per_page=1&client_id=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    const photo = data?.results?.[0];
    if (!photo) {
      return res.status(404).json({ url: null });
    }
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({ url: photo.urls.regular });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Unsplash" });
  }
}
