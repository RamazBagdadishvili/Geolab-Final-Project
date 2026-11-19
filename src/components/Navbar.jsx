import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Gamepad2, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function getLinkClass({ isActive }) {
    const base =
      "min-h-[44px] px-4 rounded-[10px] flex items-center text-sm font-medium transition";
    return isActive
      ? `${base} bg-btn text-text`
      : `${base} text-muted hover:text-text`;
  }

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="relative z-50 max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between bg-bg">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-[8px] bg-accent flex items-center justify-center text-white">
            <Gamepad2 size={18} />
          </span>
          <span className="font-heading font-bold text-lg text-text">
            GameShelf
          </span>
        </Link>

        <nav className="hidden min-[600px]:flex items-center gap-2">
          <NavLink to="/" end className={getLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shelf" className={getLinkClass}>
            My Shelf
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="min-[600px]:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] bg-btn border border-border text-text cursor-pointer"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[65px] bg-black/60 z-40 min-[600px]:hidden"
          />
          <nav className="absolute left-0 right-0 top-full bg-card border-b border-border p-4 flex flex-col gap-2 z-50 min-[600px]:hidden">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={getLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/shelf"
              onClick={() => setMenuOpen(false)}
              className={getLinkClass}
            >
              My Shelf
            </NavLink>
          </nav>
        </>
      )}
    </header>
  );
}

export default Navbar;
