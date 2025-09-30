export default function AppLogo() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br ">
      <div className="app-logo relative">
        {/* Cercle décoratif en arrière-plan */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full opacity-20 blur-2xl"></div>
        </div>
        
        {/* Container principal du logo */}
        <div className="relative bg-white rounded-2xl shadow-1xl px-4 py-2 border-4 border-emerald-500">
          {/* Ornement supérieur */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"></div>
          </div>
          
          {/* Texte principal */}
          <h1 className="text-1xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent tracking-wide">
            Touba <br /> Events
          </h1>
          
          {/* Ligne décorative */}
          <div className="mt-2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
          
          {/* Ornements en coin */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>
        </div>
        
        {/* Ombre douce en dessous */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-emerald-500 opacity-20 blur-xl rounded-full"></div>
      </div>
    </div>
  );
}