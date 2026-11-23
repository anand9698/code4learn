# Stage 1: Build the Angular application
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Angular app
RUN npm run build:pages


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Angular build output
COPY --from=builder /app/dist/pages/browser /usr/share/nginx/html/Syllabus
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
