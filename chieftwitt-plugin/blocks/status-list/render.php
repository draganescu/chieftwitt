<?php
/**
 * Server-side rendering of the status-list block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the status list for the current query.
 */

if (!function_exists('get_block_wrapper_attributes')) {
    return 'Error: WordPress version too old';
}

// Ensure we have default attributes
$attributes = wp_parse_args($attributes, [
    'postsToShow' => 5,
    'avatarSize' => 50,
    'containerBorderWidth' => '1px',
    'containerBorderRadius' => '12px',
    'containerBorderColor' => '#e1e8ed'
]);

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'chieftwitt-status-list'
]);

$query_args = [
    'post_type' => 'chieftwitt_status',
    'posts_per_page' => $attributes['postsToShow'],
    'orderby' => 'date',
    'order' => 'DESC',
    'post_status' => 'publish'
];

$query = new WP_Query($query_args);

$container_style = sprintf(
    'border-width: %s; border-radius: %s; border-style: solid; border-color: %s;',
    esc_attr($attributes['containerBorderWidth']),
    esc_attr($attributes['containerBorderRadius']),
    esc_attr($attributes['containerBorderColor'])
);
?>

<div <?php echo $wrapper_attributes; ?> style="<?php echo esc_attr($container_style); ?>">
    <?php if ($query->have_posts()): ?>
		<div class="status-list">
            <?php while ($query->have_posts()): $query->the_post(); ?>
                <article class="chieftwitt-status">
                    <div class="status-meta">
                        <div class="author-info">
                            <?php 
                            $author_id = get_the_author_meta('ID');
                            echo get_avatar($author_id, $attributes['avatarSize']); 
                            ?>
                            <span class="author-name"><?php the_author(); ?></span>
                        </div>
                        <time datetime="<?php echo esc_attr(get_the_date('c')); ?>">
                            <?php echo esc_html(get_the_date()); ?>
                        </time>
                    </div>
                    <div class="status-content">
                        <?php echo get_the_content(); ?>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="status-link">
                        <?php esc_html_e('View Status', 'chieftwitt'); ?>
                    </a>
                </article>
            <?php endwhile; ?>
        </div>
    <?php else: ?>
        <p><?php esc_html_e('No status updates found.', 'chieftwitt'); ?></p>
    <?php endif; ?>
</div>

<?php
wp_reset_postdata();