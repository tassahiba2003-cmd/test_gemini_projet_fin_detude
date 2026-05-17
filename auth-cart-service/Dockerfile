FROM node:20-alpine
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation et génération du client
RUN npm install
RUN npx prisma generate

# Copie du reste du code
COPY . .

EXPOSE 5000
CMD ["npm", "start"]