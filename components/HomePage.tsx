import React from 'react';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center font-sans" style={{ backgroundImage: "url('https://picsum.photos/id/1012/1920/1080')" }}>
      <div className="absolute inset-0 bg-black/50"></div>

      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">ProfileMatch Beauty</h1>
          <button
            onClick={onNavigateToLogin}
            className="bg-rose-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-rose-600 transition-colors shadow-md"
          >
            Sign In or Register
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Find Your Perfect<br/>Match in Beauty
        </h2>
        <p className="mt-4 text-lg md:text-xl max-w-2xl opacity-90">
          The revolutionary way to discover and book talented beauty professionals near you. Swipe, match, and look your best.
        </p>
        <button
          onClick={onNavigateToLogin}
          className="mt-8 bg-white text-rose-500 font-bold py-3 px-8 rounded-full text-lg hover:bg-rose-100 transition-colors shadow-xl transform hover:scale-105"
        >
          Get Started
        </button>
      </main>
    </div>
  );
};

export default HomePage;