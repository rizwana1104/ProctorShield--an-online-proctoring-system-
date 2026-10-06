# ProctorShield Deployment Guide

ProctorShield has been fully containerized. You can now deploy the entire application stack (Node.js API + PostgreSQL + Redis + CouchDB + Neo4j) to any server with a single command.

## Prerequisites
1. A server (e.g., AWS EC2 Ubuntu, DigitalOcean Droplet, local machine)
2. [Git](https://git-scm.com/) installed
3. [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

## Deployment Steps

### 1. Clone the Repository
Copy the ProctorShield code to your server.
```bash
git clone <your-repository-url>
cd ProctorShield
```

### 2. Start the Stack
Because the Node.js application is now defined inside the `docker-compose.yml`, it will automatically build the `Dockerfile`, connect to the internal database network, and expose the application on port `3000`.

Run the following command:
```bash
docker-compose up -d --build
```
* The `-d` flag runs the containers in the background (detached mode).
* The `--build` flag ensures the Node.js image is freshly built from the latest source code.

### 3. Verify Deployment
Check the status of all 5 containers (app, postgres, redis, couchdb, neo4j):
```bash
docker-compose ps
```

To view the live application logs:
```bash
docker-compose logs -f app
```

### 4. Database Seeding (First-time setup only)
If this is a completely fresh server, the databases will be empty. Run the seed script inside the running Node.js container to populate the initial schemas, admin user, and sample data:
```bash
docker-compose exec app node scripts/seed.js
```

### 5. Access the Application
The application is now running and bound to port 3000 on your server.
Open a web browser and go to:
\`http://<your-server-ip>:3000\`

---

## Troubleshooting

- **Databases taking too long to start?** Sometimes Node.js boots faster than Neo4j or Postgres on the first run. The backend will retry connecting, but if it crashes, simply restart the app container: `docker-compose restart app`
- **Need to update the code?** Pull the latest changes and rebuild: `docker-compose up -d --build`
- **Tear down:** To completely stop the application and destroy the database data (Warning: destructive!), run: `docker-compose down -v`
