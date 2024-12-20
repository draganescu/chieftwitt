export interface WordPressSite {
    url: string;
    username: string;
    appPassword: string;
}

class WordPressService {
    private site: WordPressSite | null = null;

    setSite(site: WordPressSite) {
        this.site = site;
    }

    private getAuthHeaders() {
        if (!this.site) {
            throw new Error('WordPress site not configured');
        }

        return {
            'Authorization': 'Basic ' + btoa(`${this.site.username}:${this.site.appPassword}`),
            'Content-Type': 'application/json',
        };
    }

    async testConnection() {
        if (!this.site) {
            throw new Error('WordPress site not configured');
        }

        const response = await fetch(`${this.site.url}/wp-json/`, {
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to connect to WordPress site: ${response.status} ${text}`);
        }
    }

    async createStatus(content: string) {
        if (!this.site) {
            throw new Error('WordPress site not configured');
        }

        const cleanUrl = this.site.url.replace(/\/$/, '');
        const endpoint = `${cleanUrl}/wp-json/chieftwitt/v1/status`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Status creation failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: text,
                    endpoint,
                    headers: this.getAuthHeaders(),
                });
                throw new Error(`Failed to create status update: ${response.status} ${text}`);
            }

            return response.json();
        } catch (error) {
            console.error('Status creation error:', error);
            throw error;
        }
    }

    async getStatuses(page: number = 1, perPage: number = 10) {
        if (!this.site) {
            throw new Error('WordPress site not configured');
        }

        const cleanUrl = this.site.url.replace(/\/$/, '');
        const endpoint = `${cleanUrl}/wp-json/chieftwitt/v1/status?page=${page}&per_page=${perPage}`;

        try {
            const response = await fetch(endpoint, {
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Status fetch failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: text,
                    endpoint,
                });
                throw new Error(`Failed to fetch status updates: ${response.status} ${text}`);
            }

            return {
                data: await response.json(),
                headers: {
                    'x-wp-total': response.headers.get('X-WP-Total'),
                    'x-wp-totalpages': response.headers.get('X-WP-TotalPages'),
                }
            };
        } catch (error) {
            console.error('Status fetch error:', error);
            throw error;
        }
    }
}

export const wordPressService = new WordPressService(); 