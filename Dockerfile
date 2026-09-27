# ─── Stage 1: Build the React Application ─────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies cleanly
RUN npm ci || npm install

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ─── Stage 2: Serve with Nginx on Cloud Run ───────────────────────
FROM nginx:alpine AS runner

# Cloud Run dynamic PORT support (defaults to 8080)
ENV PORT=8080

# Clean default configuration
RUN rm -rf /etc/nginx/conf.d/*

# Nginx alpine entrypoint processes /etc/nginx/templates/*.template with envsubst
# and outputs the final config to /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (metadata)
EXPOSE 8080

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
