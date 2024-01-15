# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build the app
# RUN npm run build

# Expose the port
EXPOSE 3000

# At the end, set the user to use when running this image
USER node

# Start the app
# CMD ["npm", "start"]
CMD ["node", "app.js"]
