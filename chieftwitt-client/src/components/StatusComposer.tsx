import { useState } from 'react';
import { wordPressService } from '../services/WordPressService';

interface StatusComposerProps {
    onStatusPosted?: () => void;
}

export function StatusComposer({ onStatusPosted }: StatusComposerProps) {
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsPosting(true);

        try {
            const response = await wordPressService.createStatus(content);
            if (response && response.content) {
                setContent('');
                setSuccessMessage('Status posted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                onStatusPosted?.();
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post status');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="status-composer">
            <h2>Post a Status Update</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        required
                        maxLength={280}
                    />
                    <div className="character-count">
                        {content.length}/280
                    </div>
                </div>

                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}

                <button type="submit" disabled={isPosting || content.length === 0}>
                    {isPosting ? 'Posting...' : 'Post Update'}
                </button>
            </form>
        </div>
    );
} 