import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameCard from "./GameCard";

const mockGame = {
  id: 3498,
  name: "Grand Theft Auto V",
  background_image: "https://media.rawg.io/media/games/test.jpg",
  rating: 4.5,
  genres: [{ id: 4, name: "Action" }],
};

describe("GameCard", () => {
  it("renders game info and calls onAdd when button is clicked", () => {
    const handleAdd = vi.fn();

    render(
      <MemoryRouter>
        <GameCard game={mockGame} isOnShelf={false} onAdd={handleAdd} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Grand Theft Auto V")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "+ Add to shelf" });
    fireEvent.click(button);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(mockGame);
  });

  it("shows On your shelf when game is already saved", () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} isOnShelf={true} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "On your shelf" }),
    ).toBeInTheDocument();
  });
});
