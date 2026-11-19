import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Gamepad2, Star, Trash2 } from "lucide-react";
import {
  getGameDetails,
  getGameScreenshots,
  getSmallImage,
  getWideImage,
} from "../api/rawg";
import { ShelfContext } from "../context/ShelfContext";

const STATUSES = ["Want to play", "Playing", "Completed"];

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToShelf, removeFromShelf, getGameStatus } =
    useContext(ShelfContext);

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullAbout, setShowFullAbout] = useState(false);

  const selectedStatus = getGameStatus(id);

  useEffect(() => {
    let ignore = false;
    window.scrollTo(0, 0);

    async function loadDetails() {
      try {
        const [gameData, shotsData] = await Promise.all([
          getGameDetails(id),
          getGameScreenshots(id),
        ]);

        if (!ignore) {
          setGame(gameData);
          setScreenshots(shotsData.results || []);
          setShowFullAbout(false);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load game details. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-11 w-40 rounded-[10px] bg-card border border-border animate-pulse" />
        <div className="aspect-[16/9] sm:aspect-[21/8] rounded-[14px] bg-card border border-border animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="h-64 rounded-[14px] bg-card border border-border animate-pulse" />
          <div className="h-64 rounded-[14px] bg-card border border-border animate-pulse" />
        </div>
      </section>
    );
  }

  if (error || !game) {
    return (
      <section>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[10px] bg-btn border border-border text-text text-sm font-medium hover:border-accent transition cursor-pointer mb-6"
        >
          <ArrowLeft size={16} />
          Back to games
        </button>

        <div className="bg-card border border-border rounded-[14px] p-6 text-center">
          <p className="text-danger">{error || "Game not found."}</p>
        </div>
      </section>
    );
  }

  const wideImage = getWideImage(game.background_image);
  const releaseYear = game.released ? game.released.slice(0, 4) : "TBA";
  const platforms =
    game.parent_platforms?.map((item) => item.platform.name).join(", ") ||
    "N/A";
  const developers =
    game.developers?.map((dev) => dev.name).join(", ") || "Unknown";
  const aboutText = game.description_raw || "No description available.";
  const isLongAbout = aboutText.length > 350;
  const displayedAbout =
    isLongAbout && !showFullAbout ? `${aboutText.slice(0, 350)}...` : aboutText;

  return (
    <section>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[10px] bg-btn border border-border text-text text-sm font-medium hover:border-accent transition cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        Back to games
      </button>

      <div className="aspect-[16/9] sm:aspect-[21/8] rounded-[14px] overflow-hidden bg-card border border-border mb-8">
        {wideImage ? (
          <img
            src={wideImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            No image available
          </div>
        )}
      </div>

      <div className="mb-8">
        {game.genres?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {game.genres.map((genre) => (
              <span
                key={genre.id}
                className="text-xs text-muted bg-btn border border-border px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl mb-4">{game.name}</h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5 text-text font-medium">
            <Star size={16} className="text-star fill-star" />
            {game.rating ? game.rating.toFixed(1) : "N/A"}
          </span>

          <span className="flex items-center gap-1.5">
            <Calendar size={16} />
            {releaseYear}
          </span>

          <span className="flex items-center gap-1.5">
            <Gamepad2 size={16} />
            {platforms}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8 min-w-0">
          <div className="bg-card border border-border rounded-[14px] p-5 text-center">
            <h2 className="text-lg mb-4">Add to your shelf</h2>

            <div className="flex flex-wrap justify-center gap-2.5">
              {STATUSES.map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => addToShelf(game, status)}
                    className={`min-h-[44px] px-4 rounded-[10px] text-sm font-medium border transition cursor-pointer ${
                      isSelected
                        ? "bg-accent-dark border-accent text-text"
                        : "bg-btn border-border text-text hover:border-accent"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}

              {selectedStatus && (
                <button
                  type="button"
                  onClick={() => removeFromShelf(game.id)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[10px] text-sm font-medium bg-btn border border-border text-danger hover:border-danger transition cursor-pointer"
                >
                  <Trash2 size={16} />
                  Remove from shelf
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl mb-3">About</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">
              {displayedAbout}
            </p>
            {isLongAbout && (
              <button
                type="button"
                onClick={() => setShowFullAbout(!showFullAbout)}
                className="mt-3 text-sm font-medium text-accent hover:underline cursor-pointer"
              >
                {showFullAbout ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {screenshots.length > 0 && (
            <div>
              <h2 className="text-xl mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {screenshots.slice(0, 6).map((shot) => (
                  <img
                    key={shot.id}
                    src={getSmallImage(shot.image)}
                    alt={`${game.name} screenshot`}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover rounded-[10px] border border-border bg-card"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="bg-card border border-border rounded-[14px] p-5">
          <h2 className="text-lg mb-2">Details</h2>

          <div className="divide-y divide-border text-sm">
            <div className="py-3 flex justify-between gap-4">
              <span className="text-muted">Developer</span>
              <span className="text-text text-right font-medium">
                {developers}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-muted">Release date</span>
              <span className="text-text font-medium">
                {game.released || "TBA"}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-muted">Metacritic</span>
              <span className="text-text font-medium">
                {game.metacritic ?? "N/A"}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-muted">Playtime</span>
              <span className="text-text font-medium">
                {game.playtime ? `${game.playtime} hours` : "N/A"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default GameDetails;
