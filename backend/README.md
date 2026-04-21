# 🚀 Getting started with Strapi (Docker)

Ce projet utilise Docker pour simplifier l'installation et le développement. Vous n'avez pas besoin d'installer Node.js ou PostgreSQL directement sur votre machine.

## 📋 Prérequis

- [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/)

## 🛠️ Installation

1. Si ce n'est pas déjà fait, créez votre fichier d'environnement à partir de l'exemple :
   ```bash
   cp .env.example .env
   ```

2. Installez les dépendances du projet **en utilisant le conteneur** :
   ```bash
   docker compose run --rm strapi npm install
   ```

## 🚀 Lancement du projet

Démarrez l'application Strapi et sa base de données PostgreSQL avec la commande suivante :

```bash
docker compose up
```

*(Astuce : Ajoutez `-d` à la fin de la commande pour lancer les conteneurs en arrière-plan : `docker compose up -d`)*

Une fois les conteneurs démarrés, votre application Strapi sera accessible à l'adresse : **[http://localhost:1337](http://localhost:1337)**
Le panel d'administration est disponible sur : **[http://localhost:1337/admin](http://localhost:1337/admin)**

### 🛑 Arrêter le projet

Pour arrêter les conteneurs :
```bash
docker compose down
```

---

## ⚙️ Autres commandes utiles (via Docker)

### Construire l'interface d'administration (`build`)
Pour reconstruire le panel d'administration de Strapi :
```bash
docker compose run --rm strapi npm run build
```

### Lancer d'autres commandes npm
Vous pouvez exécuter n'importe quelle commande npm à travers le conteneur de cette façon :
```bash
docker compose run --rm strapi npm run <votre_commande>
```

---

## 📚 En savoir plus

- [Documentation Strapi](https://docs.strapi.io) - Documentation officielle.
- [Strapi GitHub repository](https://github.com/strapi/strapi) - Code source de Strapi.
- [Strapi Discord](https://discord.strapi.io) - Communauté Strapi.
