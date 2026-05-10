/**
 * Image generation using Pollinations.ai — free, no API key needed.
 */

const IMAGE_PROXY = "https://images.weserv.nl/?url=";

export function generateImageUrl(prompt: string, seed?: number): string {
  const encodedPrompt = encodeURIComponent(prompt.trim());
  const s = seed ?? Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${s}&nologo=true`;
  console.log("[ImageGen] Generated URL:", url);
  return url;
}

function getProxyUrl(url: string): string {
  return `${IMAGE_PROXY}${encodeURIComponent(url)}`;
}

async function fetchImageBlob(url: string, timeoutMs = 15000): Promise<Blob> {
  console.log("[ImageGen] Fetching image URL:", url);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Image endpoint returned ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      const text = await response.text();
      throw new Error(`Invalid image content type: ${contentType} (${text.slice(0, 200)})`);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Image generation timed out. The service may be busy. Please try again.");
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch image blob from the generated URL.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function preloadImage(url: string): Promise<string> {
  try {
    const blob = await fetchImageBlob(url);
    const objectUrl = URL.createObjectURL(blob);
    console.log("[ImageGen] Image fetched successfully:", url, "objectUrl=", objectUrl);
    return objectUrl;
  } catch (error) {
    console.warn("[ImageGen] Direct image fetch failed, trying proxy fallback:", error);
    const proxyUrl = getProxyUrl(url);
    try {
      const blob = await fetchImageBlob(proxyUrl, 20000);
      const objectUrl = URL.createObjectURL(blob);
      console.log("[ImageGen] Proxy image fetch succeeded:", proxyUrl, "objectUrl=", objectUrl);
      return objectUrl;
    } catch (proxyError) {
      console.error("[ImageGen] Proxy fallback also failed:", proxyError);
      if (error instanceof Error && proxyError instanceof Error) {
        throw new Error(
          `Direct fetch failed (${error.message}) and proxy fetch failed (${proxyError.message}).`
        );
      }
      throw new Error("Failed to generate the image from both direct and proxy endpoints.");
    }
  }
}

export async function fetchImageAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  return response.blob();
}
