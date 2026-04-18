FROM node:18-alpine
WORKDIR /src
COPY package.json ./
RUN npm install
COPY ../docker/app .
# Nuxt tourne sur le port 3000 par défaut
EXPOSE 3000
CMD ["npm", "run", "dev"]