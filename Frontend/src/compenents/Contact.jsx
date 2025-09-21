export default function Contact() {
    return (
        <div id="contact" style={{margin:"1rem 0",maxHeight:"50rem",fontSize:"1.5rem"}} className="text-center">
            <div>
                <h1>Nous contacter</h1>
            </div>
            <div style={{margin:"1rem 0",maxHeight:"40rem"}} className="flex w-full justify-around items-center p-4 gap-4">
                <div>
                    <form style={{maxWidth:"50rem",padding:"1rem",}} className="flex flex-col justify-between items-center bg-base-300" >
                        <input style={{maxWidth:"15rem"}} className="input validator" type="email" required placeholder="mail@site.com" />
                        <div className="validator-hint">Enter valid email address</div>
                            <textarea style={{borderRadius:".2rem", width:"30rem", height:"15rem",fontSize:"1.5rem"}} className="textarea h-24" required placeholder="Une question ? Un retour ? Écrivez-nous directement."></textarea>
                        <div>
                            <button type="submit" className="btn bg-primary">Envoyé</button>
                        </div>
                    </form>
                </div>
                <div>
                    image
                </div>
            </div>
        </div>
    )
}