# Documentation de l'API et des Entités

Ce document décrit le modèle de données de l'application ainsi que les endpoints des API REST et GraphQL pour y accéder.

## 1. Modèle de Données (Entités)

Voici la liste des entités principales et leurs relations.

---

### Client
Un client représente une personne ou une entreprise qui passe des commandes.

- `nom` (string): Nom du client.
- `entreprise` (string): Nom de l'entreprise du client.
- `email` (email): Adresse email du client.
- **Relation (one-to-many)**: Un client peut avoir plusieurs `Commandes`.

---

### Produit
Un produit est un article qui peut être commandé ou utilisé dans une nomenclature.

- `nom` (string): Nom du produit.
- `prix` (decimal): Prix unitaire du produit.
- `en_stock` (integer): Quantité disponible en stock.
- `type` (enumeration):
  - `Produit Fini`
  - `Matière Première`
- **Relation (one-to-many)**: Un produit peut être inclus dans plusieurs `Lignes de Commande`.

---

### Commande
Une commande est passée par un `Client` et est composée de plusieurs `Lignes de Commande`.

- `date_commande` (datetime): Date à laquelle la commande a été passée.
- `statut` (enumeration):
  - `En cours`
  - `Livrée`
  - `Annulée`
- **Relation (many-to-one)**: Une commande est liée à un seul `Client`.
- **Relation (one-to-many)**: Une commande peut avoir plusieurs `Lignes de Commande`.

---

### Ligne de Commande (`ligne-commande`)
Une ligne de commande représente un `Produit` spécifique et sa quantité dans une `Commande`.

- `quantite` (integer): Quantité du produit commandé.
- **Relation (many-to-one)**: Une ligne de commande appartient à une seule `Commande`.
- **Relation (many-to-one)**: Une ligne de commande concerne un seul `Produit`.
- **Relation (one-to-one)**: Une ligne de commande peut avoir un `Ordre de Fabrication`.

---

### Ordre de Fabrication (`ordre-de-fabrication`)
Un ordre de fabrication (OF) est créé pour produire les articles d'une `Ligne de Commande`.

- `reference` (string): Référence unique de l'OF.
- `quantite_a_produire` (integer): Quantité du produit à fabriquer.
- `date_lancement` (datetime): Date de début de la fabrication.
- `statut` (enumeration):
  - `Planifié`
  - `En cours`
  - `Terminé`
- **Relation (one-to-one)**: Un OF est lié à un `Produit` spécifique (celui à fabriquer).
- **Relation (one-to-one)**: Un OF est lié à une seule `Ligne de Commande`.
- **Relation (one-to-many)**: Un OF peut nécessiter plusieurs `Tâches`.

---

### Tâche (`tache`)
Une tâche représente une étape spécifique dans un `Ordre de Fabrication`.

- `description_tache` (text): Description de la tâche à effectuer.
- `heures_passees` (integer): Nombre d'heures travaillées sur cette tâche.
- `employe_nom` (string): Nom de l'employé assigné.
- **Relation (many-to-one)**: Une tâche appartient à un seul `Ordre de Fabrication`.

---

### Nomenclature
Une nomenclature définit les `Matières Premières` nécessaires pour fabriquer un `Produit Fini`.

- `quantite_requise` (integer): Quantité de matière première nécessaire.
- **Relation (many-to-one)**: Une nomenclature est liée à un `Produit Fini`.
- **Relation (many-to-one)**: Une nomenclature est liée à une `Matière Première`.

## 2. Endpoints de l'API REST

L'API REST est accessible via le préfixe `/api`.

### Endpoints de base (Exemple avec `clients`)

- `GET /api/clients`: Récupérer la liste de tous les clients.
- `GET /api/clients/:id`: Récupérer un client par son ID.
- `POST /api/clients`: Créer un nouveau client.
- `PUT /api/clients/:id`: Mettre à jour un client.
- `DELETE /api/clients/:id`: Supprimer un client.

Ce modèle s'applique à toutes les autres entités (ex: `/api/produits`, `/api/commandes`, etc.).

### Endpoints Métier (Logique personnalisée)

#### Créer un Ordre de Fabrication
Crée un Ordre de Fabrication (OF) à partir d'une ligne de commande existante.

- **Endpoint**: `POST /api/ligne-commandes/:id/create-of`
- **Description**:
  - Récupère la ligne de commande spécifiée par `:id`.
  - Vérifie si un OF n'existe pas déjà pour cette ligne.
  - Crée un nouvel OF en utilisant la quantité et le produit de la ligne de commande.
- **Réponse**:
  - `201 Created`: Renvoie l'objet de l'OF nouvellement créé.
  - `404 Not Found`: Si la ligne de commande n'existe pas.
  - `400 Bad Request`: Si un OF existe déjà ou si la ligne de commande n'a pas de produit.

### Important : Population des Relations

Le paramètre `populate` est essentiel pour récupérer les données des relations.

- **Simple**: `GET /api/commandes?populate=client`
- **Imbriqué**: `GET /api/commandes?populate[client]=*&populate[ligne_commandes][populate][produit]=*`

## 3. API GraphQL

L'API GraphQL est accessible via l'endpoint unique `POST /graphql`.

### Queries et Mutations de base

Le plugin GraphQL génère automatiquement les queries (ex: `commandes`, `commande`) et les mutations (ex: `createCommande`, `updateCommande`) pour chaque entité.

### Mutations Métier (Logique personnalisée)

#### Créer un Ordre de Fabrication
Crée un Ordre de Fabrication (OF) à partir d'une ligne de commande existante.

- **Mutation**:
  ```graphql
  mutation CreateOfFromLigne($ligneCommandeId: ID!) {
    createOf(id: $ligneCommandeId) {
      data {
        id
        attributes {
          reference
          statut
          ligne_commande {
            data {
              id
            }
          }
        }
      }
    }
  }
  ```
- **Variables**:
  ```json
  {
    "ligneCommandeId": "123"
  }
  ```
- **Description**:
  - Exécute la même logique métier que l'endpoint REST.
  - Renvoie une erreur si la ligne de commande n'est pas trouvée, si un OF existe déjà, etc.
- **Réponse**: Renvoie l'entité de l'OF nouvellement créé.
