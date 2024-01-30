# Use a lightweight Node.js image as a base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the SvelteKit app
RUN npm run build

# Expose the port that your SvelteKit app will run on
EXPOSE 5173

# Specify the command to run your application
# CMD ["npm", "run", "start"]
# CMD ["npm", "run", "start"]
