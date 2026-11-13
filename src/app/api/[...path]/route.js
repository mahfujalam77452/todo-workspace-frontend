import { NextResponse } from 'next/server';
import { callBackend } from '@/lib/backend';
import { isAllowed } from '@/lib/proxy-allowlist';
import { ACCESS_COOKIE } from '@/lib/session';
import { errorResponse } from '@/lib/route-response';

const PASS_THROUGH_HEADERS = ['content-type', 'retry-after', 'x-cache'];

async function relay(backendResponse) {
  const headers = new Headers();
  for (const name of PASS_THROUGH_HEADERS) {
    const value = backendResponse.headers.get(name);
    if (value) headers.set(name, value);
  }

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204, headers });
  }
  return new NextResponse(await backendResponse.text(), { status: backendResponse.status, headers });
}

// Browser -> Next.js (this file) -> backend. The token is read from the cookie here.
async function handle(request, { params }) {
  const { path } = await params;
  const apiPath = `/${path.join('/')}`;

  if (!isAllowed(apiPath, request.method)) {
    return NextResponse.json({ error: 'Not found', code: 404 }, { status: 404 });
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required', code: 401 }, { status: 401 });
  }

  try {
    const body = request.method === 'GET' ? undefined : (await request.text()) || undefined;
    const backendResponse = await callBackend(`${apiPath}${request.nextUrl.search}`, {
      method: request.method,
      body,
      token,
    });
    return await relay(backendResponse);
  } catch (error) {
    return errorResponse(error);
  }
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;