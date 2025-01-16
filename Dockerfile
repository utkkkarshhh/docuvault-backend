FROM node:18

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Expose the application port
EXPOSE 8000

# Your existing CMD or it will be overridden by docker-compose
CMD ["npm", "run", "dev"]