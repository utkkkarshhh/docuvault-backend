# Node.js Service Setup

This document provides instructions to set up the Node.js service, including dependencies, database migration, and environment configuration.

## Setup Instructions

### 1. Install Dependencies

Run the following command to install the necessary npm packages:

```bash
npm install

### 2. Migrate the Database
npx sequelize-cli db:migrate


### 3. Install pgAdmin
Ensure you have pgAdmin installed for managing your PostgreSQL database. You can download it from pgAdmin's official website.

### 4. Configure Environment Variables
Create a .env file in the root directory of your project and insert your database credentials, port number, and other environment-specific settings. A sample .env file might look like:

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

PORT=3000

JWT_SECRET=your_jwt_secret
REGISTRATION_TOKEN=your_registration_token



###5. Setup JWT and Registration Token

Ensure you configure the JWT secret and registration token in your .env file as shown above. These are used for secure token-based authentication and registration processes.

