# Documentation de l'API et des Entités

Ce document décrit le modèle de données de l'application ainsi que les endpoints de l'API REST pour y accéder.

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

L'API est accessible via le préfixe `/api`.

### Endpoints de base (Exemple avec `clients`)

- `GET /api/clients`: Récupérer la liste de tous les clients.
- `GET /api/clients/:id`: Récupérer un client par son ID.
- `POST /api/clients`: Créer un nouveau client.
- `PUT /api/clients/:id`: Mettre à jour un client.
- `DELETE /api/clients/:id`: Supprimer un client.

Ce modèle s'applique à toutes les autres entités (ex: `/api/produits`, `/api/commandes`, etc.).

### Important : Population des Relations

Par défaut, l'API REST ne renvoie que les ID des relations pour des raisons de performance. Pour inclure les données complètes des relations, vous devez utiliser le paramètre `populate`.

#### Exemple 1 : Simple
Récupérer les commandes et peupler la relation directe avec le client.

`GET /api/commandes?populate=client`

#### Exemple 2 : Tout peupler (1er niveau)
Récupérer les commandes et peupler toutes leurs relations directes.

`GET /api/commandes?populate=*`

#### Exemple 3 : Population imbriquée (Avancé)
Récupérer les commandes, avec les détails du client, les lignes de commande, et les détails du produit pour chaque ligne.

```
GET /api/commandes?populate[client][fields][0]=nom&populate[ligne_commandes][populate][produit][fields][0]=nom
```

Une syntaxe plus simple pour une population profonde est d'utiliser des objets :

```
GET /api/commandes?populate[client]=*&populate[ligne_commandes][populate][produit]=*
```

Cette dernière requête est très utile pour obtenir un objet `Commande` complet avec toutes les informations nécessaires.
