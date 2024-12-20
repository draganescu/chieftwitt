# ChiefTwitt

ChiefTwitt is a modern WordPress plugin with a React-based frontend that enables WordPress to function as a Twitter/X-like microblogging platform. It combines the power of WordPress's content management capabilities with a modern, real-time social media experience.

## Project Structure

The project consists of two main components:

### 1. WordPress Plugin (`chieftwitt-plugin/`)
- A full-featured WordPress plugin that handles the backend functionality
- Built with modern PHP practices and WordPress standards
- Features Gutenberg blocks for enhanced content creation
- Includes custom templates and REST API endpoints

### 2. React Client (`chieftwitt-client/`)
- A modern React application built with TypeScript and Vite
- Provides a responsive, real-time user interface
- Integrates seamlessly with the WordPress backend
- Uses modern frontend development practices

## Requirements

### WordPress Plugin
- PHP 7.4 or higher
- WordPress 6.0 or higher
- Composer for dependency management

### React Client
- Node.js 16.x or higher
- npm or yarn package manager
- Modern web browser with JavaScript enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/draganescu/chieftwitt.git
cd chieftwitt
```

2. Install WordPress plugin dependencies:
```bash
cd chieftwitt-plugin
composer install
```

3. Install React client dependencies:
```bash
cd ../chieftwitt-client
npm install
```

## Development

### WordPress Plugin
- Activate the plugin through the WordPress admin interface
- The plugin will set up necessary database tables and configurations
- Development should follow WordPress coding standards

### React Client
- Start the development server:
```bash
cd chieftwitt-client
npm run dev
```
- The client will be available at `https://localhost:5173`

## Features

- Real-time microblogging functionality
- Custom Gutenberg blocks for enhanced content creation
- Modern React-based user interface
- REST API integration between WordPress and React
- Responsive design for mobile and desktop
- TypeScript for enhanced code reliability

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL v2 or later - see the LICENSE file for details.

## Author

Andrei Draganescu (@draganescu) 