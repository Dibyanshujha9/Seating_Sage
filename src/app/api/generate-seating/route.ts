import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // ✅ FIXED: Correct API endpoint
  const externalApiUrl = 'https://smartseatplanner-api-engine.onrender.com/generate-seating/';

  try {
    const formData = await request.formData();

    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      let errorMsg = `External API Error: ${apiResponse.status} ${apiResponse.statusText}`;
      try {
        const errorData = await apiResponse.json();
        errorMsg = errorData.detail || errorData.error || errorMsg;
      } catch {}
      return NextResponse.json({ error: errorMsg }, { status: apiResponse.status });
    }

    const blob = await apiResponse.blob();
    const headers = new Headers();

    headers.set(
      'Content-Type',
      apiResponse.headers.get('Content-Type') ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    headers.set(
      'Content-Disposition',
      apiResponse.headers.get('Content-Disposition') ||
        'attachment; filename="seating_plan.xlsx"'
    );

    const contentLength = apiResponse.headers.get('Content-Length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(blob, {
      status: apiResponse.status,
      headers,
    });
  } catch (error: any) {
    let errorMessage = 'Failed to proxy request to external API.';
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    if (error.cause) {
      errorMessage += ` Cause: ${String(error.cause)}`;
    }

    console.error('Proxy API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
