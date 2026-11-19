import axios from "axios";

const rawg = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: import.meta.env.VITE_RAWG_API_KEY,
  },
});

export async function getGames(params = {}) {
  const response = await rawg.get("/games", {
    params: {
      page_size: 12,
      ...params,
    },
  });
  return response.data;
}

export async function getGameDetails(id) {
  const response = await rawg.get(`/games/${id}`);
  return response.data;
}

export async function getGameScreenshots(id) {
  const response = await rawg.get(`/games/${id}/screenshots`);
  return response.data;
}

export function getSmallImage(url) {
  if (!url) return "";
  if (!url.includes("media.rawg.io/media/")) return url;
  if (url.includes("/crop/") || url.includes("/resize/")) return url;
  return url.replace("/media/", "/media/crop/600/400/");
}

export function getWideImage(url) {
  if (!url) return "";
  if (!url.includes("media.rawg.io/media/")) return url;
  if (url.includes("/crop/") || url.includes("/resize/")) return url;
  return url.replace("/media/", "/media/resize/1280/-/");
}
