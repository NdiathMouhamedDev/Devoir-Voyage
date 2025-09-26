export default function MainHome() {
    return (
        <div id="accueil"  style={{ 
            display:"flex", 
            justifyContent:"center", 
            alignItems:"center", 
            margin:"0"
        }}
            className="h-screen relative">
            <div style={{position:"absolute", bottom:"0"}} className=" bg-secondary h-full w-full">
                <div className="bg-base-300 h-full max-w-full relative m-0 p-0">
                    <div style={{position:"absolute", height:"100%",width:"100%"}} className="top-0 left-0">
                        <div className="absolute text-5xl font-bold text-white z-10 bg-base-100 text-center rounded-box" style={{ top:"25%", left:"55%", transform:"translate(-50%, -50%)" }}>
                            <h1>Bienvenue au Evenement de Touba</h1>
                            <p>Consultez les horaires, inscrivez-vous aux événements, recevez des notifications et découvrez les points d'intérêt.</p>
                        </div>
                        <figure style={{margin:"0",position:"relative"}} className="w-full h-full hover-gallery">
                        <img src="https://img.daisyui.com/images/stock/daisyui-hat-1.webp" />
                        <img src="https://img.daisyui.com/images/stock/daisyui-hat-2.webp" />
                        <img src="https://img.daisyui.com/images/stock/daisyui-hat-3.webp" />
                        <img src="https://img.daisyui.com/images/stock/daisyui-hat-4.webp" />
                    </figure>
                    </div>
                </div>
            </div>
        </div>
    )
}