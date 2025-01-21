### STAGE 1: Build ###
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the entire project
COPY . .

# Generate the production build
RUN npm run build --prod

### STAGE 2: Run ###
FROM nginxinc/nginx-unprivileged

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts from the build stage
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html


# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
