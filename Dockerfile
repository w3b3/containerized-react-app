# Base image
FROM node:slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app files
COPY . .

# Build the app
# RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
# CMD ["npm", "start"]
CMD ["node", "app.js"]
