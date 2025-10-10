# SvelteKit + PocketBase Template

A modern full-stack template using SvelteKit for the frontend and PocketBase as the backend database.

## Tech Stack

- **Frontend**: SvelteKit 2 with Svelte 5
- **Backend**: PocketBase (embedded SQLite database with real-time subscriptions)
- **Styling**: TailwindCSS 4
- **Runtime**: Bun
- **Containerization**: Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Bun](https://bun.sh/) (for local development outside Docker)

## Quick Start

1. **Clone the repository**

```sh
git clone <your-repo-url>
cd top-svelte-pocketbase
```

2. **Start the development environment**

```sh
docker compose up
```

This will start:
- **PocketBase** at `http://localhost:8090`
- **Frontend** at `http://localhost:8080`

**Note**: The `.env` file is optional. Default ports are used if not specified. To customize, create a `.env` file:

```sh
cp .env.example .env
```

3. **Set up PocketBase Admin**

On first run, visit `http://localhost:8090/_/` to create your admin account.

## Development

### Using Docker Compose (Recommended)

```sh
# Start services
docker compose up

# Start in detached mode
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build
```

### Local Development (Without Docker)

If you prefer to run locally:

```sh
# Install dependencies
bun install

# Start dev server
bun run dev
```

**Note**: You'll need to run PocketBase separately for local development.

## Project Structure

```
.
├── src/              # SvelteKit application
├── static/           # Static assets
├── pb_data/          # PocketBase data (auto-generated, gitignored)
├── pb_migrations/    # PocketBase migrations (optional)
├── docker-compose.yml
└── README.md
```

## PocketBase

### Admin Dashboard

Access the PocketBase admin UI at: `http://localhost:8090/_/`

### Creating Collections

1. Go to the admin dashboard
2. Navigate to "Collections"
3. Create your collections and define schemas
4. Collections are automatically available via the REST API and real-time subscriptions

### API Endpoints

PocketBase automatically generates REST API endpoints:

- `GET /api/collections/{collection}/records` - List records
- `GET /api/collections/{collection}/records/{id}` - Get record
- `POST /api/collections/{collection}/records` - Create record
- `PATCH /api/collections/{collection}/records/{id}` - Update record
- `DELETE /api/collections/{collection}/records/{id}` - Delete record

### Real-time Subscriptions

PocketBase supports real-time subscriptions for all collections. See the [PocketBase SDK documentation](https://pocketbase.io/docs/client-side-integration/) for implementation details.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POCKETBASE_PORT` | PocketBase port | 8090 |
| `FRONTEND_PORT` | Frontend dev server port | 8080 |
| `PUBLIC_POCKETBASE_URL` | PocketBase URL for browser | http://localhost:8090 |

## Building for Production

```sh
# Build the frontend
bun run build

# Preview the production build
bun run preview
```

For production deployment, you'll need to:
1. Build the SvelteKit app
2. Deploy PocketBase with persistent storage
3. Configure environment variables for your production URLs

## Additional Commands

```sh
# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run check
```

## Resources

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)

## License

[Your License Here]
