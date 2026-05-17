FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build de production Next.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]