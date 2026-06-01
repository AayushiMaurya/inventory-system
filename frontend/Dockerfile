# Stage 1: Build React Application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve production assets with Nginx
FROM nginx:1.25-alpine

# Copy custom built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy standard routing configuration to prevent 404s on SPA page refreshes
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]