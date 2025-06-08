
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const externalApiUrl = 'https://smartseatplanner-api-engine.onrender.com/generate-seating/';

  try {
    const formData = await request.formData();

    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      body: formData,
      // Content-Type for multipart/form-data is set automatically by fetch with FormData
    });

    if (!apiResponse.ok) {
      let errorMsg = `External API Error: ${apiResponse.status} ${apiResponse.statusText}`;
      try {
        // Try to parse error response as JSON
        const errorData = await apiResponse.json();
        errorMsg = errorData.detail || errorData.error || errorMsg;
      } catch (jsonError) {
        // If error response is not JSON, use the status text
        // console.warn("Could not parse error response as JSON from external API", jsonError);
      }
      // console.error(`External API responded with error: ${errorMsg}`);
      return NextResponse.json({ error: errorMsg }, { status: apiResponse.status });
    }

    const blob = await apiResponse.blob();

    const headers = new Headers();
    headers.set('Content-Type', apiResponse.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', apiResponse.headers.get('Content-Disposition') || 'attachment; filename="seating_plan.xlsx"');
    
    // Copy other relevant headers if necessary, but be cautious
    // For example, Content-Length might be useful if available and correct
    const contentLength = apiResponse.headers.get('Content-Length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(blob, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: headers,
    });

  } catch (error: any) {
    let errorMessage = "Failed to proxy request to external API.";
    if (error.message) {
        errorMessage += ` Details: ${error.message}`;
    }
    // Check for network-specific error cause (common in Node.js fetch or WHATWG fetch polyfills)
    if (error.cause && typeof error.cause === 'object' && 'message' in error.cause) {
        errorMessage += ` Cause: ${String(error.cause.message)}`;
    } else if (error.cause) {
        errorMessage += ` Cause: ${String(error.cause)}`;
    }
    console.error("Proxy API Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
