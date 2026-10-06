FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
