# Environment Configuration Guide

This project uses different environment configurations for development, local testing, preview, and production. This guide explains how to use and configure these environments.

## Available Environment Configurations

The project includes the following environment configuration files:

1. `.env.development` - Used for development environment
2. `.env.local` - Used for local testing
3. `.env.preview` - Used for preview/staging environment
4. `.env.production` - Used for production environment

## Environment Variables

Each environment file contains the following variables:

- `VITE_KEYCLOAK_URL` - URL of the Keycloak server
- `VITE_KEYCLOAK_REALM` - Keycloak realm name
- `VITE_KEYCLOAK_CLIENT_ID` - Keycloak client ID
- `VITE_API_URL` - URL of the backend API
- `VITE_DEBUG_MODE` - Enable/disable debug mode (true/false)
- `VITE_LOG_LEVEL` - Log level (debug, info, warn, error)

## Running the Application with Different Environments

Use the following npm scripts to run the application with different environment configurations:

### Development

```bash
# Default development environment
npm run dev

# Local environment
npm run dev:local

# Preview environment
npm run dev:preview
```

### Building for Different Environments

```bash
# Default production build
npm run build

# Development build
npm run build:dev

# Preview/staging build
npm run build:preview

# Production build (same as default build)
npm run build:prod
```

## Creating Custom Environment Configurations

To create a custom environment configuration:

1. Create a new file named `.env.{your-environment}` (e.g., `.env.staging`)
2. Add the required environment variables to the file
3. Run the application with `vite --mode {your-environment}` or add a new script to package.json

## Environment Priority

Vite loads environment variables in the following order:

1. `.env.{mode}.local` (highest priority, not committed to version control)
2. `.env.{mode}` (mode-specific)
3. `.env.local` (local overrides, not committed to version control)
4. `.env` (lowest priority)

## Security Considerations

- Never commit sensitive information like API keys or secrets to version control
- Use `.env.local` for local overrides that should not be committed
- Consider using a secrets management service for production environments 