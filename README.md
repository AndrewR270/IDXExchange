# IDXExchange
A property search application built for the 2026 Summer SDE Intern program at IDXExchange.

## Tech Stack

Data Storage: Docker, MySQL
Backend: Node.js, Express.js
Frontend: Next.js, Tailwind CSS, React

## How to Use
- Docker Desktop with a MySQL container for property data: docker start idx-mysql-local
- Backend on Express + Node.js: npm run dev (shortcut for nodemon server.js)
- Frontend on Next.js: npm run dev

## Development

### Docker MySQl Commands
- Create container: `docker run --name idx-mysql-local -e MYSQL_ROOT_PASSWORD=<pass> -e MYSQL_DATABASE=<name> -p <port>:<port> -d mysql:8`
- Pass in file: `docker exec -i idx-mysql-local mysql -u root -p"<pass>" <name> < <file>.sql`
- Enter MySQL: `docker exec -it idx-mysql-local mysql -u root -p"<pass>" <name>`

### Backend Setup Commands
- Initialize a Node.js project: `npm init -y`
- Dependencies: `npm install express mysql2 dotenv cors`
- Dev Dependencies: `npm install --save-dev nodemon` + `"dev": "nodemon server.js"` in package.json
- Make .env for DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

### Frontend Setup Commands
- Initialize a Next.js project: `npx create-next-app@latest frontend` with defaults

Automatically installs TypeScript, ESLint, No React Compiler, Tailwind CSS, App Router, etc.


