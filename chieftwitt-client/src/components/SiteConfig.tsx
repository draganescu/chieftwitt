import { useState, useEffect } from 'react';
import { type WordPressSite } from '../services/WordPressService';

interface SiteConfigProps {
    onConnect: () => void;
    onBack?: () => void;
    onDisconnect?: () => void;
    isEditMode?: boolean;
}

const STORAGE_KEY = 'wordpressSiteConfig';

export function SiteConfig({ onConnect, onBack, onDisconnect, isEditMode }: SiteConfigProps) {
    const [site, setSite] = useState<WordPressSite>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {
            url: '',
            username: '',
            appPassword: '',
        };
    });
    const [error, setError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        // Check if we have an application password in the URL hash
        const hash = window.location.hash;
        if (hash.startsWith('#apppassword=')) {
            const queryString = hash.replace('#apppassword=', '');
            const params = new URLSearchParams(queryString);
            const password = params.get('password');
            const username = params.get('user_login');
            const url = localStorage.getItem('temp_wp_url');

            if (url && password && username) {
                const newSite = { 
                    url, 
                    username,
                    appPassword: password.replace(/\s/g, '') // Remove any spaces from the password
                };
                setSite(newSite);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newSite));
                localStorage.removeItem('temp_wp_url');
                window.location.hash = '';
                onConnect();
            }
        }
    }, [onConnect]);

    useEffect(() => {
        if (!isEditMode && site.url && site.appPassword) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
        }
    }, [site, isEditMode]);

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsConnecting(true);

        try {
            // Store the URL temporarily
            const cleanUrl = site.url.replace(/\/$/, ''); // Remove trailing slash if present
            localStorage.setItem('temp_wp_url', cleanUrl);

            // Redirect to WordPress authorization URL
            const redirectUrl = window.location.origin + window.location.pathname;
            const authUrl = `${cleanUrl}/wp-admin/authorize-application.php?app_name=ChiefTwitt&success_url=${encodeURIComponent(redirectUrl + '#apppassword=')}`;
            window.location.href = authUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem(STORAGE_KEY);
        setSite({ url: '', username: '', appPassword: '' });
        if (onDisconnect) {
            onDisconnect();
        }
    };

    // If in edit mode and connected, show minimal interface
    if (isEditMode && site.appPassword) {
        return (
            <div className="site-config">
                <header className="app-header">
                    <h1>ChiefTwitt</h1>
                    {onBack && (
                        <button onClick={onBack} className="back-button">
                            ← Back to Feed
                        </button>
                    )}
                </header>

                <div className="connected-info">
                    <h2 className="connected-title">Connected WordPress Site</h2>
                    <p className="connected-url">{site.url}</p>
                    <button onClick={handleDisconnect} className="disconnect-button">
                        Disconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="site-config">
            <header className="app-header">
                <h1>ChiefTwitt</h1>
                {isEditMode && onBack && (
                    <button onClick={onBack} className="back-button">
                        ← Back to Feed
                    </button>
                )}
            </header>

            <form onSubmit={handleUrlSubmit}>
                <h2>{isEditMode ? 'WordPress Settings' : 'Connect to WordPress'}</h2>
                
                <div className="form-group">
                    <label htmlFor="url">WordPress Site URL</label>
                    <input
                        type="url"
                        id="url"
                        value={site.url}
                        onChange={(e) => setSite({ ...site, url: e.target.value })}
                        placeholder="https://your-wordpress-site.com"
                        required
                    />
                </div>

                {error && <div className="error">{error}</div>}
                
                <div className="button-group">
                    <button type="submit" className="primary-button" disabled={isConnecting}>
                        {isConnecting ? 'Connecting...' : (isEditMode ? 'Update Connection' : 'Connect')}
                    </button>
                </div>
            </form>
        </div>
    );
} 