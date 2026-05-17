# On part d'une image Linux très légère avec Node.js 18 préinstallé
FROM node:18-alpine

# On crée un dossier /app dans notre conteneur
WORKDIR /app

# On copie d'abord les fichiers de dépendances (pour optimiser le cache Docker)
COPY package*.json ./

# On installe les librairies
RUN npm install

# On génère le client Prisma (très important pour que ta BDD marche dans Docker !)
COPY prisma ./prisma/
RUN npx prisma generate

# On copie tout le reste de ton code source
COPY . .

# On ouvre le port 5002 vers l'extérieur
EXPOSE 5002

# La commande pour démarrer ton serveur
CMD ["node", "server.js"]