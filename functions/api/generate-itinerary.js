export async function onRequestPost(context) {
  const { request, env } = context;

  const key = env.ANTHROPIC_KEY;
  if (!key) {
    return Response.json({ error: "Anthropic API key not configured on server." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (err) {
    return Response.json({ error: "Failed to reach Anthropic API." }, { status: 500 });
  }
}
