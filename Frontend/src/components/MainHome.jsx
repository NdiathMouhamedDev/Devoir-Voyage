export default function MainHome() {
  return (
    <section id="accueil" className="min-h-screen relative overflow-hidden">
      {/* Fond dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent"></div>
      
      {/* Overlay avec opacité */}
      <div className="absolute inset-0 bg-base-300/20"></div>
      
      {/* Contenu principal */}
      <div className="relative h-screen flex items-center justify-center px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Texte hero */}
            <div className="text-center lg:text-left space-y-6 z-10">
              <div className="badge badge-primary badge-lg mb-4">
                Bienvenue
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content leading-tight">
                Événements de{' '}
                <span className="text-primary">Touba</span>
              </h1>
              
              <p className="text-lg md:text-xl text-base-content/80 max-w-2xl">
                Consultez les horaires, inscrivez-vous aux événements, 
                recevez des notifications et découvrez les points d'intérêt.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <a href="#events" className="btn btn-primary btn-lg gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Voir les événements
                </a>
                <a href="#contact" className="btn btn-outline btn-lg">
                  Nous contacter
                </a>
              </div>
            </div>
            
            {/* Galerie d'images */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="card bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://img.daisyui.com/images/stock/daisyui-hat-1.webp"
                      alt="Événement 1"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="card bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://img.daisyui.com/images/stock/daisyui-hat-2.webp"
                      alt="Événement 2"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="card bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://img.daisyui.com/images/stock/daisyui-hat-3.webp"
                      alt="Événement 3"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="card bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://img.daisyui.com/images/stock/daisyui-hat-4.webp"
                      alt="Événement 4"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <a href="#events" className="text-base-content/50 hover:text-base-content transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}