import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShelfProvider } from "../context/ShelfContext";
import MyShelf from "./MyShelf";

describe("MyShelf", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows empty state when no games are saved", () => {
    render(
      <MemoryRouter>
        <ShelfProvider>
          <MyShelf />
        </ShelfProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Your shelf is empty")).toBeInTheDocument();
    expect(screen.getByText("Browse games")).toBeInTheDocument();
  });

  it("displays saved games and removes a game when Remove is clicked", () => {
    const savedGames = [
      {
        id: 5286,
        name: "Tomb Raider",
        background_image: "",
        genre: "Action",
        rating: 4.1,
        status: "Playing",
      },
    ];
    localStorage.setItem("gameshelf_items", JSON.stringify(savedGames));

    render(
      <MemoryRouter>
        <ShelfProvider>
          <MyShelf />
        </ShelfProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Tomb Raider")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(screen.queryByText("Tomb Raider")).not.toBeInTheDocument();
    expect(screen.getByText("Your shelf is empty")).toBeInTheDocument();
  });
});
