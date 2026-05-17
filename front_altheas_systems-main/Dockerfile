FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 1. On récupère les variables passées par le docker-compose
ARG NEXT_PUBLIC_API_AUTH
ARG NEXT_PUBLIC_API_SUPPORT
ARG NEXT_PUBLIC_API_CATALOG
ARG NEXT_PUBLIC_API_ADMIN

# 2. On les rend disponibles pour figer les bonnes URL pendant le build Next.js
ENV NEXT_PUBLIC_API_AUTH=$NEXT_PUBLIC_API_AUTH
ENV NEXT_PUBLIC_API_SUPPORT=$NEXT_PUBLIC_API_SUPPORT
ENV NEXT_PUBLIC_API_CATALOG=$NEXT_PUBLIC_API_CATALOG
ENV NEXT_PUBLIC_API_ADMIN=$NEXT_PUBLIC_API_ADMIN

# Build de production Next.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]