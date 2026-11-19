function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted text-center sm:text-left">
        <p>GameShelf — GeoLab React Final Project</p>

        <div className="flex items-center gap-5">
          <a
            href="https://rawg.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition"
          >
            Game data from RAWG
          </a>

          <a
            href="https://geolab.edu.ge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center hover:opacity-80 transition"
          >
            <img
              src="/geolab-logo.png"
              alt="GeoLab"
              loading="lazy"
              className="h-9 w-9 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
