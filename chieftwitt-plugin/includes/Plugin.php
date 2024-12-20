<?php

namespace ChiefTwitt;

class Plugin {
    private static $_instance = null;
    private $plugin_path;
    
    public static function get_instance() {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {
        $this->plugin_path = plugin_dir_path(dirname(__FILE__));
        add_action('init', [$this, 'register_post_type']);
        add_action('init', [$this, 'register_blocks']);
        add_action('init', [$this, 'add_rewrite_rules']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_filter('single_template', [$this, 'load_status_template']);
        add_filter('archive_template', [$this, 'load_status_template']);
        add_filter('template_include', [$this, 'load_feed_template']);
        add_filter('query_vars', [$this, 'add_query_vars']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
    }

    public function add_query_vars($vars) {
        $vars[] = 'chieftwitt_feed';
        return $vars;
    }

    public function add_rewrite_rules() {
        add_rewrite_rule(
            '^current-feed/?$',
            'index.php?chieftwitt_feed=1',
            'top'
        );
        flush_rewrite_rules();
    }

    public function load_feed_template($template) {
        if (get_query_var('chieftwitt_feed')) {
            // Set up the main query for status posts
            global $wp_query;
            $wp_query = new \WP_Query([
                'post_type' => 'chieftwitt_status',
                'posts_per_page' => 10,
                'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
                'orderby' => 'date',
                'order' => 'DESC'
            ]);

            $template_path = $this->plugin_path . 'templates/status.php';
            if (file_exists($template_path)) {
                return $template_path;
            }
        }
        return $template;
    }

    public function register_post_type() {
        register_post_type('chieftwitt_status', [
            'labels' => [
                'name' => __('Status Updates', 'chieftwitt'),
                'singular_name' => __('Status Update', 'chieftwitt'),
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'chieftwitt_status',
            'supports' => ['title', 'editor', 'author', 'thumbnail'],
            'has_archive' => true,
            'menu_icon' => 'dashicons-twitter',
            'rewrite' => ['slug' => 'status'],
            'capability_type' => 'post',
            'show_in_graphql' => true,
            'graphql_single_name' => 'status',
            'graphql_plural_name' => 'statuses',
            'template' => [
                ['core/paragraph']
            ],
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        ]);

        // Register meta fields for the REST API
        register_rest_field('chieftwitt_status', 'author', [
            'get_callback' => function($post) {
                return [
                    'name' => get_the_author_meta('display_name', $post['author']),
                    'avatar' => get_avatar_url($post['author']),
                ];
            },
            'schema' => [
                'description' => __('Author information', 'chieftwitt'),
                'type' => 'object',
                'properties' => [
                    'name' => [
                        'type' => 'string',
                        'description' => __('Author name', 'chieftwitt'),
                    ],
                    'avatar' => [
                        'type' => 'string',
                        'description' => __('Author avatar URL', 'chieftwitt'),
                        'format' => 'uri',
                    ],
                ],
            ],
        ]);
    }

    public function register_rest_routes() {
        register_rest_route('chieftwitt/v1', '/status', [
            [
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_status'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'content' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'wp_kses_post',
                    ],
                ],
            ],
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'get_statuses'],
                'permission_callback' => '__return_true',
                'args' => [
                    'page' => [
                        'required' => false,
                        'type' => 'integer',
                        'default' => 1,
                    ],
                    'per_page' => [
                        'required' => false,
                        'type' => 'integer',
                        'default' => 10,
                    ],
                ],
            ],
        ]);
    }

    public function check_permission() {
        return current_user_can('publish_posts');
    }

    public function create_status($request) {
        $content = $request->get_param('content');
        
        $post_data = [
            'post_content' => $content,
            'post_title' => wp_trim_words($content, 10, '...'),
            'post_status' => 'publish',
            'post_type' => 'chieftwitt_status',
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return new \WP_Error(
                'chieftwitt_error',
                __('Failed to create status update.', 'chieftwitt'),
                ['status' => 500]
            );
        }

        return rest_ensure_response([
            'id' => $post_id,
            'content' => $content,
            'link' => get_permalink($post_id),
        ]);
    }

    public function get_statuses($request) {
        $page = $request->get_param('page');
        $per_page = $request->get_param('per_page');

        $query = new \WP_Query([
            'post_type' => 'chieftwitt_status',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $statuses = [];
        foreach ($query->posts as $post) {
            // Setup postdata so that WordPress functions work correctly
            setup_postdata($post);
            
            $statuses[] = [
                'id' => $post->ID,
                'content' => [
                    'raw' => $post->post_content,
                    'rendered' => apply_filters('the_content', $post->post_content)
                ],
                'date' => $post->post_date,
                'link' => get_permalink($post->ID),
                'author' => [
                    'name' => get_the_author_meta('display_name', $post->post_author),
                    'avatar' => get_avatar_url($post->post_author),
                ],
            ];
        }
        
        // Reset postdata after we're done
        wp_reset_postdata();

        $response = rest_ensure_response($statuses);
        $response->header('X-WP-Total', $query->found_posts);
        $response->header('X-WP-TotalPages', $query->max_num_pages);

        return $response;
    }

    public function load_status_template($template) {
        global $post;

        if ($post && $post->post_type === 'chieftwitt_status') {
            $template_path = $this->plugin_path . 'templates/status.php';
            if (file_exists($template_path)) {
                return $template_path;
            }
        }

        return $template;
    }

    public function register_blocks() {
        register_block_type($this->plugin_path . 'blocks/status-list');
    }

    public function enqueue_block_editor_assets() {
        $block_path = $this->plugin_path . 'blocks/status-list';
        if (file_exists($block_path . '/build/index.js')) {
            wp_enqueue_script(
                'chieftwitt-status-list-editor',
                plugins_url('blocks/status-list/build/index.js', dirname(__FILE__)),
                ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n']
            );
        }
        
        if (file_exists($block_path . '/build/index.css')) {
            wp_enqueue_style(
                'chieftwitt-status-list-editor',
                plugins_url('blocks/status-list/build/index.css', dirname(__FILE__))
            );
        }
    }
} 