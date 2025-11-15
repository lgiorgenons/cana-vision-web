# Stage 1 - build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Allow overriding the API URL at build time (default keeps proxying to /api)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2 - serve static assets with nginx (Cloud Run expects a listening process)
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=builder /app/dist ./
# Replace default nginx config with SPA-friendly version
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
