# Use the latest official node image as the base image
FROM node:slim

# Set working directory inside the container
WORKDIR /app

# Copy over package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm ci \
 && npm cache clean --force
 # && mv /app/node_modules /node_modules

# Copy over all other source files
COPY . .

# Start the app
CMD [ "npm", "run", "dev" ]
