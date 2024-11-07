FROM node:20

# Install dependencies required for Puppeteer
RUN apt-get update && apt-get install -y wget gnupg libxss1 libasound2 libnss3 libx11-xcb1 libatk-bridge2.0-0 libgtk-3-0

# Create and set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port (if required)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
