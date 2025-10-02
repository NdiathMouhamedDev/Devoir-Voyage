import React, { useState, useEffect } from 'react';
import { Shield, Bug, Eye, Copy, CheckCircle } from 'lucide-react';
import MinNav from '../components/miniComponents/MinNav';

const AdminVerificationDebug = () => {
  const [testUrl, setTestUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Debug | Touba Events";
  }, []);

  const testVerificationUrl = async () => {
    if (!testUrl) {
      alert('Veuillez entrer une URL de test');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('Testing URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        redirect: 'manual', // Ne pas suivre les redirections automatiquement
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      let data = null;
      try {
        data = await response.text();
        console.log('Response body:', data);
        
        // Essayer de parser en JSON si possible
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Garder le texte tel quel si ce n'est pas du JSON
        }
      } catch (e) {
        console.error('Error reading response body:', e);
      }

      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        body: data,
        redirected: response.redirected,
        url: response.url,
        type: response.type
      });

    } catch (error) {
      console.error('Test error:', error);
      setResult({
        error: true,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTestUrl = () => {
    const baseUrl = 'http://127.0.0.1:8000/api/verify-admin-request';
    const userId = 1; // ID de test
    const hash = 'test-hash'; // Hash de test
    const expires = Math.floor(Date.now() / 1000) + 3600; // Expire dans 1 heure
    const signature = 'test-signature'; // Signature de test
    
    const url = `${baseUrl}/${userId}/${hash}?expires=${expires}&signature=${signature}`;
    setTestUrl(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-6">
              <Bug className="w-6 h-6 text-warning" />
              <h2 className="card-title text-2xl">Debug Vérification Admin</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Générateur d'URL de test */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Générateur d'URL de test
                </h3>
                
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={generateTestUrl}
                >
                  Générer URL de test
                </button>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL de vérification</span>
                  </label>
                  <div className="join">
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      className="input input-bordered join-item flex-1 text-xs"
                      placeholder="Collez votre URL de vérification ici..."
                    />
                    {testUrl && (
                      <button 
                        className="btn btn-outline join-item"
                        onClick={() => copyToClipboard(testUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={testVerificationUrl}
                  disabled={loading || !testUrl}
                  className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
                >
                  {loading ? 'Test en cours...' : 'Tester la vérification'}
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Instructions</h3>
                
                <div className="alert alert-info">
                  <Eye className="w-4 h-4" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Comment tester :</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Demandez d'abord le rôle admin</li>
                      <li>Vérifiez votre email</li>
                      <li>Copiez le lien de l'email ici</li>
                      <li>Testez le lien</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-base-200 rounded-lg p-3">
                  <h4 className="font-medium mb-2">États possibles :</h4>
                  <div className="space-y-1 text-sm">
                    <div className="badge badge-success badge-sm">200</div> <span>Redirection vers succès</span><br/>
                    <div className="badge badge-error badge-sm">403</div> <span>Problème d'authentification</span><br/>
                    <div className="badge badge-warning badge-sm">404</div> <span>Route non trouvée</span><br/>
                    <div className="badge badge-info badge-sm">302</div> <span>Redirection normale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Résultats */}
            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Résultat du test
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="card bg-base-200">
                    <div className="card-body p-4">
                      <h4 className="font-semibold mb-2">Statut HTTP</h4>
                      <div className={`badge text-white ${
                        result.status === 200 ? 'badge-success' :
                        result.status === 302 ? 'badge-info' :
                        result.status === 403 ? 'badge-error' :
                        result.status === 404 ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {result.status} {result.statusText}
                      </div>
                      
                      {result.redirected && (
                        <div className="mt-2">
                          <span className="text-xs">Redirected to:</span>
                          <div className="text-xs break-all bg-base-300 p-1 rounded">{result.url}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="card bg-base-200">
                    <div className="card-body p-4">
                      <h4 className="font-semibold mb-2">Headers importants</h4>
                      <div className="space-y-1 text-xs">
                        {result.headers?.location && (
                          <div><strong>Location:</strong> <span className="break-all">{result.headers.location}</span></div>
                        )}
                        {result.headers?.['content-type'] && (
                          <div><strong>Content-Type:</strong> {result.headers['content-type']}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                {result.body && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Réponse du serveur</h4>
                    <div className="mockup-code">
                      <pre className="text-xs overflow-auto">
                        {typeof result.body === 'object' 
                          ? JSON.stringify(result.body, null, 2)
                          : result.body
                        }
                      </pre>
                    </div>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div className="alert alert-error mt-4">
                    <div>
                      <h4 className="font-semibold">Erreur de test</h4>
                      <p>{result.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <MinNav/>
    </div>
  );
};

export default AdminVerificationDebug;