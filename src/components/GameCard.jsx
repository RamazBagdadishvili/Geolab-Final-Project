import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { getSmallImage } from "../api/rawg";

function GameCard({ game, isOnShelf = false, onAdd }) {
  const imageUrl = getSmallImage(game.background_image);
  const mainGenre = game.genres?.[0]?.name;

  return (
    <article className="bg-card border border-border rounded-[14px] overflow-hidden flex flex-col">
      <Link to={`/game/${game.id}`} className="block group">
        <div className="aspect-[16/10] bg-btn overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={game.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted">
              No image
            </div>
          )}
        </div>

        <div className="p-3 pb-2.5 sm:p-4 sm:pb-3">
          <h3 className="text-sm sm:text-base font-bold text-text line-clamp-1 group-hover:text-accent transition mb-2 sm:mb-2.5">
            {game.name}
          </h3>

          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {mainGenre ? (
              <span className="text-[11px] sm:text-xs text-muted bg-btn border border-border px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full truncate min-w-0">
                {mainGenre}
              </span>
            ) : (
              <span />
            )}

            <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-text shrink-0">
              <Star size={14} className="text-star fill-star" />
              {game.rating ? game.rating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4 mt-auto">
        <button
          type="button"
          onClick={() => onAdd && onAdd(game)}
          className={`w-full min-h-[44px] px-2.5 sm:px-4 rounded-[10px] text-xs sm:text-sm font-medium border transition cursor-pointer ${
            isOnShelf
              ? "bg-accent-dark border-accent text-text"
              : "bg-btn border-border text-text hover:border-accent"
          }`}
        >
          {isOnShelf ? "On your shelf" : "+ Add to shelf"}
        </button>
      </div>
    </article>
  );
}

export default GameCard;
