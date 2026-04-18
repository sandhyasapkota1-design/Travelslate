export async function onRequestGet(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const destination = searchParams.get("destination");

  if (!q || !destination) {
    return Response.json({ error: "Missing q or destination" }, { status: 400 });
  }

  const key = env.GOOGLE_PLACES_KEY;
  if (!key) {
    return Response.json({ error: "Google Places key not configured" }, { status: 500 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + " " + destination)}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch from Google Places" }, { status: 500 });
  }
}
