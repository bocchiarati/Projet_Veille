# Utilise une image Node.js Alpine, légère et sécurisée
FROM node:20-alpine as base

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers de définition des dépendances
COPY package.json package-lock.json* ./

# Installe les dépendances. Le script "postinstall" de Nuxt
# exécutera automatiquement "nuxt prepare" pour générer le .nuxt
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

# Expose le port sur lequel Nuxt va écouter
EXPOSE 3000

# Définit les variables d'environnement pour que le serveur soit accessible
# depuis l'extérieur du conteneur
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# La commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
