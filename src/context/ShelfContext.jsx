import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = "gameshelf_items";

export const ShelfContext = createContext();

export function ShelfProvider({ children }) {
  const [shelf, setShelf] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shelf));
  }, [shelf]);

  function addToShelf(game, status = "Want to play") {
    setShelf((prev) => {
      const exists = prev.some((item) => item.id === game.id);
      if (exists) {
        return prev.map((item) =>
          item.id === game.id ? { ...item, status } : item,
        );
      }

      const newItem = {
        id: game.id,
        name: game.name,
        background_image: game.background_image || "",
        genre: game.genres?.[0]?.name || game.genre || "",
        rating: game.rating || 0,
        status,
      };

      return [newItem, ...prev];
    });
  }

  function updateStatus(gameId, status) {
    setShelf((prev) =>
      prev.map((item) => (item.id === gameId ? { ...item, status } : item)),
    );
  }

  function removeFromShelf(gameId) {
    setShelf((prev) => prev.filter((item) => item.id !== gameId));
  }

  function getGameStatus(gameId) {
    const found = shelf.find((item) => item.id === Number(gameId));
    return found ? found.status : "";
  }

  return (
    <ShelfContext.Provider
      value={{
        shelf,
        addToShelf,
        updateStatus,
        removeFromShelf,
        getGameStatus,
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
}
