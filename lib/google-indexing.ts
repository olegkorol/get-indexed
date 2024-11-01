// deno-lint-ignore-file no-explicit-any
import { JWT } from "npm:google-auth-library";

type IndexingType = "URL_UPDATED" | "URL_DELETED";

interface IndexingResponse {
  success: boolean;
  url: string;
  error?: string;
  status?: number;
  urlNotificationMetadata?: IndexingStatusResponse;
}

interface IndexingStatusResponse {
  success: boolean;
  url: string;
  error?: string;
  status?: number;
  latest_update?: {
    type: "URL_UPDATED";
    notify_time: string;
  };
  latest_remove?: {
    type: "URL_DELETED";
    notify_time: string;
  };
}

/**
 * Submits URLs to Google's Indexing API
 * @param urls Array of URLs to be indexed
 * @param type Type of indexing request (URL_UPDATED or URL_DELETED)
 * @param credentials Service account credentials JSON
 */
export async function submitUrlsToGoogleIndex(
  urls: string[],
  type: IndexingType = "URL_UPDATED",
  credentials: Record<string, any>,
): Promise<IndexingResponse[]> {
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const results: IndexingResponse[] = [];

  for (const url of urls) {
    try {
      const response = await client.request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          url,
          type,
        },
      });

      results.push({
        success: response.status === 200,
        status: response.status,
        url,
        urlNotificationMetadata: (response.data as any)
          ?.urlNotificationMetadata as IndexingStatusResponse ?? null,
      });
    } catch (error) {
      results.push({
        success: false,
        url,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

/**
 * Sends a request to Google's Indexing API to get the status of the URLs.
 * The request is sent to `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=ENCODED_URL`
 * @param urls Array of URLs to get the status of
 * @param credentials Service account credentials JSON
 */
export async function getUrlStatus(
  urls: string[],
  credentials: Record<string, any>,
) {
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const results: IndexingStatusResponse[] = [];

  for (const url of urls) {
    try {
      const response = await client.request({
        url:
          `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${
            encodeURIComponent(url)
          }`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      results.push({
        ...(response.data as IndexingStatusResponse),
        success: response.status === 200,
        status: response.status,
      });
    } catch (error) {
      results.push({
        success: false,
        status: (error as any)?.response?.status,
        url,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}
