import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { ShelfContext } from "../context/ShelfContext";
import { getSmallImage } from "../api/rawg";

const TABS = ["All", "Want to play", "Playing", "Completed"];
const STATUSES = ["Want to play", "Playing", "Completed"];

const SORT_OPTIONS = [
  { label: "Recently added", value: "recent" },
  { label: "Highest rated", value: "rating" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

function MyShelf() {
  const { shelf, updateStatus, removeFromShelf } = useContext(ShelfContext);
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  function getTabCount(tab) {
    if (tab === "All") return shelf.length;
    return shelf.filter((game) => game.status === tab).length;
  }

  const filteredGames =
    activeTab === "All"
      ? shelf
      : shelf.filter((game) => game.status === activeTab);

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl mb-2">My Shelf</h1>
        <p className="text-muted">
          Keep track of games you want to play, are playing, or completed.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = getTabCount(tab);

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-sm font-medium border transition cursor-pointer ${
                  isActive
                    ? "bg-accent border-accent text-white"
                    : "bg-btn border-border text-muted hover:text-text hover:border-accent"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-card text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <label htmlFor="shelf-sort" className="text-sm text-muted">
            Sort by:
          </label>
          <select
            id="shelf-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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

      {sortedGames.length === 0 ? (
        <div className="bg-card border border-border rounded-[14px] p-8 sm:p-12 text-center">
          <h2 className="text-xl mb-2">
            {shelf.length === 0
              ? "Your shelf is empty"
              : `No games in "${activeTab}"`}
          </h2>
          <p className="text-muted mb-6">
            {shelf.length === 0
              ? "Find games you like and add them to your personal shelf."
              : "Add more games or change the status of an existing game."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-[10px] bg-accent text-white font-medium hover:opacity-90 transition"
          >
            Browse games
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedGames.map((game) => {
            const imageUrl = getSmallImage(game.background_image);

            return (
              <div
                key={game.id}
                className="bg-card border border-border rounded-[14px] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Link
                    to={`/game/${game.id}`}
                    className="w-24 sm:w-28 aspect-[16/10] rounded-[10px] overflow-hidden bg-btn shrink-0 block"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={game.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/game/${game.id}`}
                      className="font-heading font-bold text-base sm:text-lg text-text hover:text-accent transition line-clamp-1 block"
                    >
                      {game.name}
                    </Link>

                    <div className="flex items-center gap-2.5 mt-1.5">
                      {game.genre && (
                        <span className="text-xs text-muted bg-btn border border-border px-2.5 py-0.5 rounded-full">
                          {game.genre}
                        </span>
                      )}

                      {game.rating > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-text">
                          <Star size={13} className="text-star fill-star" />
                          {game.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <select
                    value={game.status}
                    onChange={(e) => updateStatus(game.id, e.target.value)}
                    className="flex-1 sm:flex-none min-h-[44px] pl-3.5 pr-8 rounded-[10px] bg-btn border border-border text-sm text-text focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeFromShelf(game.id)}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-[10px] bg-btn border border-border text-danger text-sm font-medium hover:border-danger transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyShelf;
