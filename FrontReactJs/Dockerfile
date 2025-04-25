# Use the official Node.js 18 image as a base
FROM node:23-slim

# Add ip command (iproute2)
RUN apt-get update && apt-get install -y iproute2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
