import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    RangeControl,
    TextControl,
    Spinner
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const useStatuses = (postsToShow = 5) => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                setLoading(true);
                const response = await apiFetch({
                    path: `/wp/v2/chieftwitt_status?per_page=${postsToShow}&orderby=date&order=desc`,
                });
                setStatuses(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses();
    }, [postsToShow]);

    return { statuses, loading, error };
};

registerBlockType('chieftwitt/status-list', {
    edit: function Edit({ attributes, setAttributes }) {
        const blockProps = useBlockProps();
        const { statuses, loading, error } = useStatuses(attributes.postsToShow);

        const containerStyle = {
            borderWidth: attributes.containerBorderWidth,
            borderRadius: attributes.containerBorderRadius,
            borderColor: attributes.containerBorderColor,
            borderStyle: 'solid'
        };

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Status List Settings', 'chieftwitt')}>
                        <RangeControl
                            label={__('Number of posts to show', 'chieftwitt')}
                            value={attributes.postsToShow}
                            onChange={(value) => setAttributes({ postsToShow: value })}
                            min={1}
                            max={20}
                        />
                        <RangeControl
                            label={__('Avatar Size', 'chieftwitt')}
                            value={attributes.avatarSize}
                            onChange={(value) => setAttributes({ avatarSize: value })}
                            min={20}
                            max={100}
                        />
                        <TextControl
                            label={__('Border Width', 'chieftwitt')}
                            value={attributes.containerBorderWidth}
                            onChange={(value) => setAttributes({ containerBorderWidth: value })}
                            help={__('Enter a value with unit (e.g., 1px)', 'chieftwitt')}
                        />
                        <TextControl
                            label={__('Border Radius', 'chieftwitt')}
                            value={attributes.containerBorderRadius}
                            onChange={(value) => setAttributes({ containerBorderRadius: value })}
                            help={__('Enter a value with unit (e.g., 12px)', 'chieftwitt')}
                        />
                        <TextControl
                            label={__('Border Color', 'chieftwitt')}
                            value={attributes.containerBorderColor}
                            onChange={(value) => setAttributes({ containerBorderColor: value })}
                            help={__('Enter a color value (e.g., #e1e8ed)', 'chieftwitt')}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div style={containerStyle}>
                    {error && <div className="error">{error}</div>}
                    
                    {loading ? (
                        <div className="loading">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="status-list">
                            {statuses.length === 0 ? (
                                <p>{__('No status updates found.', 'chieftwitt')}</p>
                            ) : (
                                statuses.map((status) => (
                                    <article key={status.id} className="chieftwitt-status">
                                        <div className="status-meta">
                                            <div className="author-info">
                                                <img 
                                                    src={status.author.avatar} 
                                                    alt={status.author.name || __('Author', 'chieftwitt')}
                                                    style={{ width: attributes.avatarSize, height: attributes.avatarSize }}
                                                    className="avatar"
                                                />
                                                <span className="author-name">
                                                    {status.author.name || __('Author', 'chieftwitt')}
                                                </span>
                                            </div>
                                            <time dateTime={status.date}>
                                                {new Date(status.date).toLocaleDateString()}
                                            </time>
                                        </div>
                                        <div 
                                            className="status-content"
                                            dangerouslySetInnerHTML={{ __html: status.content.rendered }}
                                        />
                                        <a href={status.link} className="status-link">
                                            {__('View Status', 'chieftwitt')}
                                        </a>
                                    </article>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}); 