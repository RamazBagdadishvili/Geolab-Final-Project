import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getGames } from "../api/rawg";
import { ShelfContext } from "../context/ShelfContext";
import GameCard from "../components/GameCard";

const GENRES = [
  { label: "All", slug: "" },
  { label: "Action", slug: "action" },
  { label: "RPG", slug: "role-playing-games-rpg" },
  { label: "Indie", slug: "indie" },
  { label: "Strategy", slug: "strategy" },
  { label: "Puzzle", slug: "puzzle" },
];

const SORT_OPTIONS = [
  { label: "Popularity", value: "" },
  { label: "Highest rated", value: "-rating" },
  { label: "Metacritic", value: "-metacritic" },
  { label: "Newest", value: "-released" },
  { label: "Name (A-Z)", value: "name" },
];

function Home() {
  const navigate = useNavigate();
  const { addToShelf, getGameStatus } = useContext(ShelfContext);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  function buildParams(pageNumber) {
    const params = { page: pageNumber };
    if (searchQuery) params.search = searchQuery;
    if (selectedGenre) params.genres = selectedGenre;
    if (sortBy) params.ordering = sortBy;
    return params;
  }

  useEffect(() => {
    let ignore = false;

    async function loadGames() {
      const params = { page: 1 };
      if (searchQuery) params.search = searchQuery;
      if (selectedGenre) params.genres = selectedGenre;
      if (sortBy) params.ordering = sortBy;

      try {
        const data = await getGames(params);
        if (!ignore) {
          setGames(data.results || []);
          setPage(1);
          setHasMore(Boolean(data.next));
        }
      } catch {
        if (!ignore) {
          setError("Failed to load games. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      ignore = true;
    };
  }, [searchQuery, selectedGenre, sortBy]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed === searchQuery) return;
    setLoading(true);
    setError("");
    setSearchQuery(trimmed);
  }

  function handleClearSearch() {
    setSearchInput("");
    if (!searchQuery) return;
    setLoading(true);
    setError("");
    setSearchQuery("");
  }

  function handleGenreChange(slug) {
    if (slug === selectedGenre) return;
    setLoading(true);
    setError("");
    setSelectedGenre(slug);
  }

  function handleSortChange(e) {
    const value = e.target.value;
    if (value === sortBy) return;
    setLoading(true);
    setError("");
    setSortBy(value);
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await getGames(buildParams(nextPage));
      setGames((prev) => [...prev, ...(data.results || [])]);
      setPage(nextPage);
      setHasMore(Boolean(data.next));
    } catch {
      setError("Failed to load more games. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRetry() {
    setLoading(true);
    setError("");
    try {
      const data = await getGames(buildParams(1));
      setGames(data.results || []);
      setPage(1);
      setHasMore(Boolean(data.next));
    } catch {
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="text-center max-w-2xl mx-auto py-4 sm:py-6 mb-10">
        <a
          href="https://geolab.edu.ge"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-card border border-border text-xs sm:text-sm text-muted hover:text-text hover:border-accent transition"
        >
          <img
            src="/geolab-logo.png"
            alt="GeoLab"
            className="h-5 w-5 object-contain"
          />
          <span>GeoLab React Final Project</span>
        </a>

        <h1 className="text-3xl sm:text-5xl mb-3">Find your next game</h1>
        <p className="text-muted mb-6">
          Browse popular games, explore details, and organize what you want to
          play on your shelf.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search games..."
              className="w-full min-h-[44px] pl-10 pr-10 rounded-[10px] bg-card border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent transition"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-text cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="min-h-[44px] px-6 rounded-[10px] bg-accent text-white font-medium cursor-pointer hover:opacity-90 transition"
          >
            Search
          </button>
        </form>
      </div>

      <h2 className="text-xl sm:text-2xl mb-4">
        {searchQuery ? `Results for "${searchQuery}"` : "Popular games"}
      </h2>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const isActive = selectedGenre === genre.slug;
            return (
              <button
                key={genre.label}
                type="button"
                onClick={() => handleGenreChange(genre.slug)}
                className={`min-h-[44px] px-4 rounded-full text-sm font-medium border transition cursor-pointer ${
                  isActive
                    ? "bg-accent border-accent text-white"
                    : "bg-btn border-border text-muted hover:text-text hover:border-accent"
                }`}
              >
                {genre.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <label htmlFor="sort-select" className="text-sm text-muted">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="min-h-[44px] pl-3.5 pr-8 rounded-[10px] bg-card border border-border text-sm text-text focus:outline-none focus:border-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-[14px] h-[240px] sm:h-[310px] animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-card border border-border rounded-[14px] p-6 text-center">
          <p className="text-danger mb-4">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-[44px] px-5 rounded-[10px] bg-accent text-white font-medium cursor-pointer hover:opacity-90 transition"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="bg-card border border-border rounded-[14px] p-8 text-center">
          <p className="text-muted">
            No games found. Try another search or genre.
          </p>
        </div>
      )}

      {!loading && !error && games.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-5">
            {games.map((game) => {
              const isOnShelf = Boolean(getGameStatus(game.id));
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  isOnShelf={isOnShelf}
                  onAdd={() => {
                    if (isOnShelf) {
                      navigate("/shelf");
                    } else {
                      addToShelf(game, "Want to play");
                    }
                  }}
                />
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-h-[44px] px-6 rounded-[10px] bg-btn border border-border text-text font-medium hover:border-accent disabled:opacity-50 transition cursor-pointer"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Home;
