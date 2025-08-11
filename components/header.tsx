export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-24 flex items-start justify-between px-4 md:px-8 z-30 pt-4 md:pt-4">
      <h1 className="text-4xl md:text-7xl font-bold text-slate-300 tracking-tight">diet sunglasses</h1>
      
      <div className="flex items-center gap-3 md:gap-4 pt-1 md:pt-2">
        {/* Contact icon */}
        <a
          href="mailto:diet.sunglasses.photography@gmail.com"
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Contact"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-300 w-6 h-6 md:w-7 md:h-7"
          >
            <path
              d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        
        {/* Instagram icon */}
        <a
          href="https://www.instagram.com/citizenband/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Instagram"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-300 w-5 h-5 md:w-6 md:h-6"
          >
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="17.5"
              cy="6.5"
              r="1.5"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}