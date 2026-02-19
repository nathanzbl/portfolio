export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-xl text-indigo-600">Portfolio</a>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#projects" className="hover:text-indigo-600 transition-colors">Projects</a>
          <a href="#resume" className="hover:text-indigo-600 transition-colors">Resume</a>
          <a
            href="/game"
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            Play
          </a>
        </div>
      </div>
    </nav>
  );
}
