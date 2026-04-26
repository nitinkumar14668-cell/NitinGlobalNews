export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyACRfUg4Azm82iAqszsLrcLU6EX0cZGyCc";

let cachedVideos: any[] = [];
let isFetching = false;

export async function getYoutubeVideos(): Promise<any[]> {
  if (cachedVideos.length > 0) {
    return cachedVideos;
  }
  
  if (isFetching) {
    // Wait a bit if currently fetching
    await new Promise(resolve => setTimeout(resolve, 500));
    return cachedVideos;
  }
  
  isFetching = true;
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=latest+news&type=video&maxResults=20&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      cachedVideos = data.items;
      return cachedVideos;
    }
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
  } finally {
    isFetching = false;
  }
  
  return [];
}
