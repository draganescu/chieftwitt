<?php

/**
 * Plugin Name: ChiefTwitt
 * Plugin URI: https://github.com/yourusername/chieftwitt
 * Description: A Twitter-like status update system for WordPress
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: chieftwitt
 * Category: social
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('CHIEFTWITT_VERSION', '1.0.0');
define('CHIEFTWITT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CHIEFTWITT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoloader for plugin classes
spl_autoload_register(
    function ($class) {

    $prefix = 'ChiefTwitt\\';
    $base_dir = CHIEFTWITT_PLUGIN_DIR . 'includes/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Initialize plugin
add_action('plugins_loaded', function () {
    // Load plugin classes
    require_once CHIEFTWITT_PLUGIN_DIR . 'includes/Plugin.php';
    \ChiefTwitt\Plugin::get_instance();
});
