# Cadre commun d’analyse — Projet GraphQL vs REST

## 1. Grille d’analyse commune

Cette grille sert de référence pour lire les résultats du projet.  
Elle permet d’éviter une comparaison floue ou seulement impressionniste, en fixant dès le départ les critères qui devront être observés sur chaque scénario.

| Critère                        | Définition                                                                       | Ce qu’il faut relever concrètement                                                            | Qui alimente principalement |
| ------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------- |
| Couverture fonctionnelle       | Vérifier que REST et GraphQL permettent bien de couvrir les mêmes besoins métier | mêmes scénarios disponibles, mêmes données récupérables, mêmes écritures possibles ou non     | Clément + Sofien            |
| Performance réseau             | Coût des échanges entre le front et l’API                                        | nombre de requêtes, taille totale des réponses, sur-récupération, appels supplémentaires      | Sofien                      |
| Performance perçue             | Impression réelle côté utilisateur                                               | temps de chargement d’une vue, temps jusqu’à affichage complet, fluidité                      | Sofien                      |
| Complexité d’intégration front | Effort nécessaire pour brancher une vue                                          | quantité de code, nombre d’appels à assembler, transformations de données, lisibilité du code | Sofien                      |
| Clarté du contrat d’API        | Facilité à comprendre ce que l’API expose                                        | lisibilité des endpoints REST, lisibilité du schéma GraphQL, prévisibilité des réponses       | Nathan + Sofien             |
| Expérience développeur         | Confort de travail du développeur                                                | facilité à explorer, tester, comprendre, autocomplétion, doc disponible                       | Sofien                      |
| Gouvernance et contrôle        | Facilité à encadrer l’usage de l’API                                             | permissions, contrôle des accès, profondeur des requêtes, surface exposée                     | Clément + Nathan            |
| Maintenabilité / évolutivité   | Facilité à faire évoluer l’application                                           | ajout d’un champ, impact d’un changement, stabilité du front                                  | Sofien + Nathan             |
| Pertinence métier ERP          | Adéquation au cas d’usage choisi                                                 | capacité à représenter des données très liées, vues riches, besoins métier réalistes          | Nathan                      |

---

## 2. Scénarios retenus pour la comparaison

Cette liste rassemble les cas les plus pertinents pour comparer REST et GraphQL dans le cadre du mini ERP.  
L’objectif est d’avoir un panel équilibré entre cas simples, cas relationnels et cas métier plus riches.

### 2.1 Cas simples

#### Scénario 1 — Fiche client simple

Afficher un client par son identifiant, avec uniquement ses champs propres.

**Intérêt :**

- cas de base
- comparaison sur une lecture simple
- peu de relations

#### Scénario 2 — Liste de clients

Afficher une liste de clients.

**Intérêt :**

- simplicité de récupération
- pagination éventuelle
- lisibilité des réponses

#### Scénario 3 — Fiche produit simple

Afficher un produit avec ses champs de base : nom, prix, stock, catégorie, type.

**Intérêt :**

- entité centrale du modèle
- lecture simple sans forte imbrication

---

### 2.2 Cas relationnels

#### Scénario 4 — Client avec ses commandes

Afficher un client et la liste de ses commandes.

**Intérêt :**

- première relation 1 → n
- observation du nombre d’appels
- structure de réponse plus riche

#### Scénario 5 — Commande avec ses lignes

Afficher une commande avec toutes ses lignes de commande.

**Intérêt :**

- cas ERP très classique
- comparaison sur un objet métier composite

#### Scénario 6 — Commande complète

Afficher une commande avec :

- le client
- les lignes de commande
- le produit associé à chaque ligne

**Intérêt :**

- scénario fortement relationnel
- très pertinent pour comparer REST et GraphQL
- bon cas pour mesurer l’agrégation des données

---

### 2.3 Cas métier riches

#### Scénario 7 — Produit fini avec sa nomenclature

Afficher un produit fini avec la liste des matières premières requises et les quantités associées.

**Intérêt :**

- cas métier représentatif
- données imbriquées
- comparaison sur une structure profonde

#### Scénario 8 — Ordre de fabrication avec ses tâches

Afficher un ordre de fabrication avec :

- le produit fabriqué
- les tâches associées

**Intérêt :**

- bon cas de relation métier
- utile pour observer profondeur et lisibilité

#### Scénario 9 — Ordre de fabrication complet

Afficher un ordre de fabrication avec :

- le produit fabriqué
- les tâches
- la nomenclature du produit concerné

**Intérêt :**

- vue métier riche
- cas profond et potentiellement coûteux
- très bon révélateur des différences entre REST et GraphQL

---

### 2.4 Cas agrégés

#### Scénario 10 — Dashboard simple ERP

Afficher une vue synthétique contenant :

- nombre total de commandes
- commandes en attente
- ordres de fabrication en cours
- produits à stock faible

**Intérêt :**

- cas d’agrégation
- plusieurs blocs de données
- très bon scénario pour observer la multiplication des appels côté REST

---

### 2.5 Cas d’écriture

#### Scénario 11 — Création d’un client

Créer un client.

**Intérêt :**

- écriture simple
- comparaison des mécanismes de création

#### Scénario 12 — Création d’une commande avec ligne

Créer une commande liée à un client, puis ajouter au moins une ligne de commande.

**Intérêt :**

- écriture avec relation
- cas métier réaliste
- utile pour observer la lisibilité des opérations d’écriture

---

## 3. Format standard de retour

L’objectif de ce format est d’éviter que les résultats soient dispersés ou difficiles à relire.  
Chaque membre doit fournir une sortie exploitable directement par la suite du projet.

---

### 3.1 Format de retour attendu de Clément

Clément doit fournir un document court contenant :

#### État du backend

- comment lancer le projet
- comment lancer la base
- comment lancer le seed
- dépendances importantes

#### Modèle implémenté

- entités réellement créées
- relations réellement disponibles
- champs importants
- éléments du schéma non implémentés ou partiels

#### API exposée

- liste des routes REST utiles
- endpoint GraphQL
- opérations réellement testables

#### Jeu de données

- volume injecté
- cas simples présents
- cas riches présents

#### Limites connues

- bugs
- relations incomplètes
- comportements inattendus
- éléments non terminés

---

### 3.2 Format de retour attendu de Sofien

Sofien doit fournir une fiche **par scénario**.

#### Modèle de fiche de scénario

```md
## Nom du scénario

### Objectif métier

Décrire ce que la vue ou l’action est censée faire.

### Version REST

- Route(s) utilisée(s) :
- Nombre de requêtes :
- Taille totale des réponses :
- Temps observé :
- Remarques :

### Version GraphQL

- Requête utilisée :
- Nombre de requêtes :
- Taille totale des réponses :
- Temps observé :
- Remarques :

### Comparaison

- Quelle version est la plus simple à intégrer ?
- Quelle version est la plus lisible ?
- Quelle version réduit les appels ?
- Quels problèmes ou limites ont été observés ?

### Biais / limites

- Cache actif ou non :
- Nombre de répétitions du test :
- Volume de données :
- Conditions particulières :
```

---

### 3.3 Format minimal attendu pour Nathan

Nathan centralise les résultats et prépare la synthèse.
Pour que ce travail soit faisable, chaque retour reçu doit préciser :

- ce qui a été implémenté ou testé
- ce qui fonctionne
- ce qui ne fonctionne pas
- ce qui reste partiel
- ce qui peut être démontré
- ce qui peut être comparé proprement

---

## 4. Questions de synthèse finales

Ces questions guideront la lecture des résultats et la conclusion du projet.
Elles doivent rester peu nombreuses pour éviter une synthèse trop dispersée.

### Question 1

Sur les cas simples, REST et GraphQL apportent-ils une différence réellement visible ?

### Question 2

Sur les cas relationnels riches, GraphQL réduit-il effectivement le nombre d’appels et la quantité de logique côté front ?

### Question 3

Le gain éventuel de GraphQL côté consommation compense-t-il la complexité supplémentaire côté gouvernance et contrôle ?

### Question 4

Dans le cadre de cet ERP, quels scénarios paraissent plus naturels en REST, et lesquels justifient réellement GraphQL ?

### Question 5

Le fait que Strapi génère automatiquement REST et GraphQL réduit-il fortement les différences, ou celles-ci restent-elles visibles côté consommation ?

### Question 6

Quelle conclusion peut être défendue sans exagération à partir des résultats obtenus ?

---

## 5. Ce qu’il faut fixer en réunion

À l’issue de la réunion, les points suivants doivent être validés :

1. La liste finale des scénarios retenus
2. La grille d’analyse commune
3. Le format de retour attendu pour Clément et Sofien
4. Les questions de synthèse finales
5. Le périmètre exact des cas “montrables” dans le projet

---

## 6. Résumé opérationnel

### Clément

Doit livrer un backend stable, documenté, avec un périmètre clair et un seed exploitable.

### Sofien

Doit livrer un front de démonstration et des mesures comparables, scénario par scénario.

### Nathan

Doit centraliser, relire les résultats à travers la grille commune, puis construire une synthèse cohérente.
