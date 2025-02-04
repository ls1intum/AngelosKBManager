# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install


ARG ANGULAR_ENV=production
# Copy the application code and build the app
COPY . ./
RUN npm run build -- --configuration=${ANGULAR_ENV} --base-href=/knowledge-manager/

# Stage 2: Serve the app with NGINX
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/knowledge-manager /usr/share/nginx/html

# Expose port 80 for internal communication
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]