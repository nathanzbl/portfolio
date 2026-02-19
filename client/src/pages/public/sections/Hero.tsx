export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16"
    >
      <div className="text-center max-w-3xl px-6">
        <p className="text-indigo-600 font-semibold text-lg mb-4 tracking-wide">Hi, I'm</p>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Nathan Blatter
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Full-stack developer building clean, modern web experiences.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            View My Work
          </a>
          <a
            href="#about"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            About Me
          </a>
        </div>
      </div>
    </section>
  );
}
