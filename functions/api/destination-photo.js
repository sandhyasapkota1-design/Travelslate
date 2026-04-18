export async function onRequestGet(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    return Response.json({ error: "Missing destination" }, { status: 400 });
  }

  const key = env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return Response.json({ error: "Unsplash key not configured" }, { status: 500 });
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&orientation=landscape&per_page=1&client_id=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    const photo = data?.results?.[0];
    if (!photo) {
      return Response.json({ url: null }, { status: 404 });
    }
    return new Response(JSON.stringify({ url: photo.urls.regular }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800"
      }
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch from Unsplash" }, { status: 500 });
  }
}
