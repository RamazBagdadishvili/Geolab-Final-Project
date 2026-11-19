function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-[1200px] mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-sm text-muted">
        <div className="flex justify-center sm:justify-start">
          <a
            href="https://geolab.edu.ge"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 hover:text-text transition"
          >
            <img
              src="/geolab-logo.png"
              alt="GeoLab"
              loading="lazy"
              className="h-10 w-10 object-contain"
            />
            <span>Final Project</span>
          </a>
        </div>

        <p className="text-center font-heading font-bold text-base text-text">
          GameShelf
        </p>

        <div className="text-center sm:text-right">
          <a
            href="https://rawg.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition"
          >
            Game data from RAWG
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
