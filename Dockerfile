# Build stage
FROM node:24-alpine3.22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass env var at build time
ARG VITE_PROD
ENV VITE_PROD=$VITE_PROD

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf
