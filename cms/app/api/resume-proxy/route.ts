import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["res.cloudinary.com", "localhost", "127.0.0.1"]);

// Apne backend ka host bhi allow karo
try {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) ALLOWED_HOSTS.add(new URL(api).hostname);
} catch {}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new NextResponse(`Host not allowed: ${parsed.hostname}`, {
      status: 403,
    });
  }

  try {
    const upstream = await fetch(parsed.toString());
    if (!upstream.ok) {
      return new NextResponse(
        `Upstream returned ${upstream.status} for ${parsed.hostname}`,
        { status: upstream.status },
      );
    }

    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (e: any) {
    return new NextResponse(`Fetch failed: ${e?.message || "unknown"}`, {
      status: 502,
    });
  }
}
