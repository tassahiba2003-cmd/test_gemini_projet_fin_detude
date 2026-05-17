FROM node:20-alpine

WORKDIR /app

# 1. On copie d'abord les fichiers listant les dépendances
COPY package*.json ./
COPY prisma ./prisma/

# 2. On installe les dépendances Node.js
RUN npm install

# 3. On génère le client Prisma pour la base de données
RUN npm run db:generate

# 4. On copie tout le reste de ton code
COPY . .

# 5. On expose le port 5001 (celui utilisé par le support)
EXPOSE 5001

# 6. Commande pour démarrer l'application
CMD ["npm", "start"]