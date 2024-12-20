import { useEffect, useState } from 'react';
import { wordPressService } from '../services/WordPressService';
import { StatusComposer } from './StatusComposer';

interface Status {
    id: number;
    content: string | { rendered: string };
    date: string;
    link: string;
    author: {
        name: string;
        avatar: string;
    };
}

interface StatusListProps {
    onSettingsClick: () => void;
}

const getRenderedContent = (content: string | { rendered: string }): string => {
    if (typeof content === 'string') {
        return content;
    }
    return content.rendered;
};

export function StatusList({ onSettingsClick }: StatusListProps) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStatuses = async (pageNum: number) => {
        try {
            setLoading(true);
            const response = await wordPressService.getStatuses(pageNum);
            setStatuses(response.data);
            setTotalPages(parseInt(response.headers['x-wp-totalpages'] || '1'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load statuses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses(page);
    }, [page]);

    const handleStatusPosted = () => {
        // Refresh the list when a new status is posted
        fetchStatuses(1);
        setPage(1);
    };

    return (
        <div className="status-list-container">
            <header className="app-header">
                <h1>ChiefTwitt</h1>
                <button onClick={onSettingsClick} className="settings-button">
                    ⚙️ Settings
                </button>
            </header>

            <div className="composer-section">
                <StatusComposer onStatusPosted={handleStatusPosted} />
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
                <div className="loading">Loading statuses...</div>
            ) : (
                <>
                    <div className="status-list">
                        {statuses.map((status) => (
                            <article key={status.id} className="status-card">
                                <div className="status-meta">
                                    <div className="author-info">
                                        <img src={status.author.avatar} alt={status.author.name} className="avatar" />
                                        <span className="author-name">{status.author.name}</span>
                                    </div>
                                    <time dateTime={status.date}>
                                        {new Date(status.date).toLocaleDateString()}
                                    </time>
                                </div>
                                <div className="status-content"
                                    dangerouslySetInnerHTML={{ __html: getRenderedContent(status.content) }}
                                />
                                <a href={status.link} target="_blank" rel="noopener noreferrer" className="view-link">
                                    View on site ↗
                                </a>
                            </article>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                                className="pagination-button"
                            >
                                ← Previous
                            </button>
                            <span className="page-info">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === totalPages}
                                className="pagination-button"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 