import axios from "axios";

const rawg = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: import.meta.env.VITE_RAWG_API_KEY,
  },
});

const BLOCKED_TAGS = [
  "nsfw",
  "hentai",
  "khentai",
  "erotic",
  "eroge",
  "porn",
  "sex",
  "ecchi",
  "lewd",
  "adult",
  "adult-only",
  "adults-only",
  "18",
  "18-plus",
  "bdsm",
  "futa",
  "harem",
  "yaoi",
  "yuri",
];

const BLOCKED_UNRATED_TAGS = ["sexual-content", "nudity"];

const BLOCKED_WORDS =
  /\b(hentai|porn|nsfw|erotic|eroge|sex|sexy|xxx|nude|nudity|waifu|strip|milf|bdsm|boobs|tits|futa|ecchi|lewd|harem)\b/i;

export function isSafeGame(game) {
  if (!game || !game.background_image) return false;
  if (game.esrb_rating?.slug === "adults-only") return false;
  if (BLOCKED_WORDS.test(game.name || "") || BLOCKED_WORDS.test(game.slug || "")) {
    return false;
  }

  const tagSlugs = (game.tags || []).map((tag) => tag.slug);
  if (tagSlugs.some((slug) => BLOCKED_TAGS.includes(slug))) return false;
  if (
    !game.metacritic &&
    tagSlugs.some((slug) => BLOCKED_UNRATED_TAGS.includes(slug))
  ) {
    return false;
  }

  return true;
}

export async function getGames(params = {}) {
  const queryParams = {
    page_size: 12,
    exclude_additions: true,
    ...params,
  };

  if (!params.search && params.ordering) {
    queryParams.metacritic = "1,100";
  }

  const response = await rawg.get("/games", { params: queryParams });
  const results = (response.data.results || []).filter(isSafeGame);

  return {
    ...response.data,
    results,
  };
}

export async function getGameDetails(id) {
  const response = await rawg.get(`/games/${id}`);
  if (!isSafeGame(response.data)) {
    throw new Error("Game is not available");
  }
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
