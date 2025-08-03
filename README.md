# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c2148979-e052-47a5-b2b3-e2d1d92f966a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c2148979-e052-47a5-b2b3-e2d1d92f966a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Keycloak Authentication

## Keycloak Authentication Setup

This project uses Keycloak for authentication and authorization. Follow these steps to set up Keycloak:

### 1. Install and Run Keycloak

You can run Keycloak using Docker:

```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### 2. Configure Keycloak

1. Access the Keycloak Admin Console at http://localhost:8080
2. Log in with the admin credentials (admin/admin)
3. Create a new realm (e.g., "your-realm")
4. Create a new client:
   - Client ID: your-client-id
   - Client Protocol: openid-connect
   - Access Type: public
   - Valid Redirect URIs: http://localhost:5173/* (or your application URL)
   - Web Origins: http://localhost:5173 (or your application URL)

### 3. Configure Environment Variables

The project includes multiple environment configurations:
- `.env.development` - Development environment
- `.env.local` - Local environment
- `.env.preview` - Preview/staging environment
- `.env.production` - Production environment

Each environment file contains the following variables:
```
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
VITE_API_URL=http://localhost:8000/api
VITE_DEBUG_MODE=true|false
VITE_LOG_LEVEL=debug|info|warn|error
```

Update these values to match your Keycloak configuration.

For more details on environment configuration, see [ENV_SETUP.md](ENV_SETUP.md).

### 4. Create Users and Roles

1. In the Keycloak Admin Console, create roles like "admin", "user", etc.
2. Create users and assign roles to them
3. Make sure to set email and other user attributes that are used in the application

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c2148979-e052-47a5-b2b3-e2d1d92f966a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
