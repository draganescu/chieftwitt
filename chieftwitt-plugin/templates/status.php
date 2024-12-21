<div class="chieftwitt-status-container">
    <?php if (is_singular('chieftwitt_status')): ?>
        <article class="chieftwitt-status">
            <div class="status-meta">
                <div class="author-info">
                    <?php echo get_avatar(get_the_author_meta('ID'), 50); ?>
                    <span class="author-name"><?php the_author(); ?></span>
                </div>
                <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
            </div>
            <div class="status-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php else: ?>
        <h1 class="page-title"><?php _e('Status Updates', 'chieftwitt'); ?></h1>
        <?php if (have_posts()): ?>
            <div class="status-list">
                <?php while (have_posts()): the_post(); ?>
                    <article class="chieftwitt-status">
                        <div class="status-meta">
                            <div class="author-info">
                                <?php echo get_avatar(get_the_author_meta('ID'), 50); ?>
                                <span class="author-name"><?php the_author(); ?></span>
                            </div>
                            <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                        </div>
                        <div class="status-content">
                            <?php the_content(); ?>
                        </div>
                        <a href="<?php the_permalink(); ?>" class="status-link"><?php _e('View Status', 'chieftwitt'); ?></a>
                    </article>
                <?php endwhile; ?>
            </div>
            <?php the_posts_pagination([
                'mid_size' => 2,
                'prev_text' => __('← Previous', 'chieftwitt'),
                'next_text' => __('Next →', 'chieftwitt'),
            ]); ?>
        <?php else: ?>
            <p><?php _e('No status updates found.', 'chieftwitt'); ?></p>
        <?php endif; ?>
    <?php endif; ?>
</div>

<style>
.chieftwitt-status-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    color: #2c3338;
}

.chieftwitt-status {
    background: #fff;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.status-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.author-info img {
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.author-name {
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

time {
    color: #5f6368;
    font-size: 0.9rem;
}

.status-content {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
    letter-spacing: -0.011em;
}

.status-content p {
    margin-bottom: 1rem;
}

.status-content p:last-child {
    margin-bottom: 0;
}

.status-link {
    display: inline-block;
    color: #1da1f2;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s ease;
}

.status-link:hover {
    color: #1a91da;
    text-decoration: underline;
}

.page-title {
    margin-bottom: 2.5rem;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #1a1a1a;
}

.nav-links {
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    font-size: 0.95rem;
    font-weight: 500;
}

.nav-links a {
    color: #1da1f2;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.nav-links a:hover {
    background-color: rgba(29, 161, 242, 0.1);
}
</style>