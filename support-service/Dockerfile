FROM node:20-alpine

# 1. On se place dans un sous-dossier pour recréer ton architecture locale
WORKDIR /app/support-service

# 2. On copie les dépendances du support
COPY support-service/package*.json ./
COPY support-service/prisma-generate.cjs ./
COPY support-service/prisma ./prisma/

# 3. LE COUP DE MAGIE : On copie le dossier prisma du voisin pour que le script le trouve !
COPY auth-cart-service/prisma /app/auth-cart-service/prisma

# 4. On installe et on génère (le chemin ../auth-cart-service va maintenant fonctionner)
RUN npm install
RUN npm run db:generate

# 5. On copie le reste de ton code
COPY support-service/ .

EXPOSE 5001

CMD ["npm", "start"]