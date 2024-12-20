<?php
/**
 * Template for displaying ChiefTwitt status updates
 */

get_header();
?>

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
}

.chieftwitt-status {
    background: #fff;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.status-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.author-info img {
    border-radius: 50%;
}

.status-content {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.status-link {
    display: inline-block;
    color: #1da1f2;
    text-decoration: none;
}

.status-link:hover {
    text-decoration: underline;
}

.page-title {
    margin-bottom: 2rem;
}

.nav-links {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
}
</style>

<?php get_footer(); ?> 