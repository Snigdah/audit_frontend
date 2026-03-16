# # Build stage
# FROM node:20-alpine AS builder
# WORKDIR /app

# # Install dependencies
# COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# RUN npm ci

# # Copy source and build
# COPY . .
# RUN npm run build:docker

# # Production stage
# FROM nginx:alpine

# # Remove default nginx website
# RUN rm -rf /usr/share/nginx/html/*

# # Copy build output
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose port
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]


# -------- Build Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy project files
COPY . .

# Build the Vite project
RUN npm run build

# -------- Production Stage --------
FROM nginx:1.27-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]