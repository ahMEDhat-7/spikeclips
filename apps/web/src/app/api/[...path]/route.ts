import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function proxyRequest(req: NextRequest) {
  const url = new URL(req.url);
  const apiPath = url.pathname.replace("/api", "/api");
  const targetUrl = `${API_BASE}${apiPath}${url.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key === "host" || key === "connection") return;
    headers.set(key, value);
  });

  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
    // @ts-expect-error duplex is needed for streaming request bodies
    init.duplex = "half";
  }

  const res = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  res.headers.forEach((value, key) => {
    if (key === "transfer-encoding") return;
    responseHeaders.set(key, value);
  });

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}
