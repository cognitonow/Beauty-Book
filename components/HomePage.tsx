import React from 'react';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-rose-50 to-slate-100 font-sans flex flex-col">
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ProfileMatch Beauty</h1>
          <div className="flex items-center space-x-2">
            <button
                onClick={onNavigateToLogin}
                className="text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
                Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-800">
          Find Your Perfect<br/>Match in Beauty
        </h2>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">
          The revolutionary way to discover and book talented beauty professionals near you. Swipe, match, and look your best.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={onNavigateToSignUp}
            className="flex-1 bg-rose-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-rose-600 transition-colors shadow-xl transform hover:scale-105"
          >
            Create an Account
          </button>
          <button
            onClick={onNavigateToLogin}
            className="flex-1 bg-white text-slate-700 border border-slate-300 font-bold py-3 px-6 rounded-full text-lg hover:bg-slate-50 transition-colors shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;