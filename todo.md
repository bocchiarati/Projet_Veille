## Tout ce qui est produit doit être transmissible

Chacun doit livrer :

- du code
- une documentation courte
- un état d’avancement clair
- ce qui est prêt / ce qui manque / ce qui bloque

---

# 1) Clément — API, base de données, schéma, seeder

Clément construit la **base technique du projet**. Son travail doit être **stable, compréhensible et exploitable par Sofien et Nathan**.

## Objectif

Fournir un backend propre avec :

- la base de données
- le schéma relationnel
- les données de test
- l’API REST
- l’API GraphQL
- une documentation minimale pour que Sofien puisse brancher le front et réaliser les mesures

## Ce qu’il doit produire

### A. Schéma métier clair

Il doit formaliser :

- les entités principales
- leurs attributs
- leurs relations
- les contraintes métier importantes

Exemple pour un ERP :

- clients
- produits
- devis
- lignes de devis
- factures
- paiements
- utilisateurs
- rôles

## B. Schéma de base de données

Il doit fournir :

- un schéma lisible
- les clés primaires
- les clés étrangères
- les cardinalités
- les contraintes importantes

Pas uniquement dans le code : il faut aussi un rendu exploitable visuellement ou textuellement.

## C. Seeder réaliste

Le seeder doit être pensé pour l’analyse, pas seulement pour “remplir vite”. Il faut :

- assez de données pour observer des différences
- des relations réalistes
- plusieurs niveaux de complexité

Exemple :

- quelques clients simples
- des devis avec plusieurs lignes
- des factures liées à des clients et paiements
- des volumes différents pour comparer des cas simples et des cas riches

## D. API REST et GraphQL alignées

Point essentiel : les deux API doivent exposer **le même périmètre métier**.

Il faut définir un périmètre minimal commun, par exemple :

- récupérer un client
- récupérer une liste de clients
- récupérer un devis avec ses lignes
- récupérer une facture avec client + paiements
- créer un client
- créer un devis

Le comparatif doit porter sur les **mêmes cas d’usage**, sinon l’analyse sera bancale.

## E. Documentation de passation

Clément doit remettre un document très court avec :

- comment lancer le projet
- comment lancer la base
- comment lancer le seeder
- les URLs REST
- l’endpoint GraphQL
- les identifiants éventuels
- les limites connues
- les éléments non finis

## Ce qu’il doit transmettre à Sofien

Sofien doit recevoir :

- un projet qui démarre sans bricolage
- la liste exacte des routes REST
- les requêtes GraphQL de base ou la structure du schéma
- le jeu de données disponible
- les cas d’usage officiellement supportés

## Ce qu’il doit transmettre à Nathan

Nathan doit recevoir :

- le schéma métier
- le schéma de base de données
- le périmètre fonctionnel exact
- les choix techniques faits
- les limites connues de l’implémentation
- les hypothèses à rappeler dans la synthèse

## Critères de qualité pour Clément

Le travail est bon si :

- le modèle de données se comprend rapidement
- REST et GraphQL sont comparables
- le projet se lance facilement
- le dataset est exploitable
- rien d’important n’est implicite

---

# 2) Sofien — Front + analyses + mesures

Sofien ne doit pas seulement “faire un front”. Il doit construire un **outil de démonstration et de mesure**.

## Objectif

Créer un front minimal mais utile, capable de :

- consommer REST et GraphQL
- reproduire les mêmes cas d’usage
- rendre visibles les différences
- produire des mesures comparables

Le front n’a pas besoin d’être “beau”. Il doit être **propre, stable et instrumenté**.

## Ce qu’il doit produire

### A. Front orienté démonstration

Le front doit permettre de tester les mêmes vues ou actions avec :

- une version REST
- une version GraphQL

Le parallèle doit être évident.

Exemples de pages utiles :

- fiche client
- liste de clients
- devis détaillé
- facture détaillée
- dashboard simple avec plusieurs blocs de données

## B. Protocole de test identique

Pour chaque cas d’usage, Sofien doit définir :

- quelle action est testée
- quelle route REST est appelée
- quelle requête GraphQL est appelée
- quelles données sont censées s’afficher
- dans quelles conditions le test est refait

Sans protocole fixe, les mesures ne vaudront rien.

## C. Liste des éléments testables

Voici la liste des éléments à mesurer, ou au minimum à observer proprement.

### Réseau / données

- nombre de requêtes envoyées
- taille totale des réponses
- taille moyenne par requête
- présence d’overfetching
- besoin ou non de multiplier les appels

### Temps / performance perçue

- temps de réponse brut
- temps total de chargement d’une vue
- temps jusqu’à affichage complet
- différence à froid / à chaud
- impact du cache si mesurable

### Complexité côté intégration front

- quantité de logique nécessaire pour assembler les données
- simplicité de récupération des données nécessaires
- besoin de faire plusieurs appels REST pour un seul écran
- lisibilité du code d’appel REST vs GraphQL

### Robustesse / maintenabilité

- facilité à faire évoluer une vue
- facilité à ajouter un champ
- impact d’un changement de données sur le front
- facilité à comprendre la structure retournée

### Documentation / expérience développeur

- facilité à découvrir l’API
- facilité à tester une requête
- auto-complétion / introspection côté GraphQL
- clarté des endpoints côté REST

### Cas complexes

- écran avec données liées
- liste + détail
- objet avec relations imbriquées
- scénario riche ERP : facture + client + lignes + paiements

## D. Format des résultats

Sofien ne doit pas seulement “dire ce qu’il a vu”. Il doit produire :

- un tableau par scénario
- une méthode de mesure
- les résultats bruts
- une première interprétation
- les limites de mesure

## Ce qu’il doit transmettre à Nathan

Nathan doit recevoir :

- les scénarios testés
- les métriques relevées
- les résultats bruts
- les tableaux comparatifs
- les captures éventuelles
- une interprétation courte pour chaque scénario
- les biais ou limites des tests

## Ce qu’il doit demander à Clément

Sofien doit exiger de Clément :

- une API stable
- un périmètre clair
- des jeux de données fixes
- des endpoints documentés
- des requêtes GraphQL testables immédiatement

## Critères de qualité pour Sofien

Le travail est bon si :

- les tests sont reproductibles
- les cas REST et GraphQL sont comparables
- les métriques sont compréhensibles
- les résultats sont exploitables, et non de simples impressions
- le front aide à démontrer, pas seulement à “faire joli”

---

# 3) Nathan — concaténation des données et synthèse

Nathan a un rôle central : transformer le travail technique en **analyse compréhensible, structurée et défendable**.

## Objectif

Faire le lien entre :

- la veille théorique
- le backend réalisé
- les tests menés
- les résultats observés
- les conclusions utiles pour le projet

Il ne s’agit pas seulement de “rassembler”, mais bien de **mettre en cohérence**.

## Ce qu’il doit produire

### A. Cadre commun de lecture

Nathan doit définir dès maintenant la grille qui servira à lire les résultats :

- performance
- complexité
- maintenabilité
- qualité du contrat d’API
- expérience développeur
- gouvernance
- pertinence selon le cas d’usage

Ainsi, Clément et Sofien savent dès le départ comment leur travail sera exploité.

## B. Consolidation des éléments techniques

Nathan doit récupérer de Clément :

- le modèle métier
- le schéma de données
- le périmètre fonctionnel
- la logique des endpoints
- les choix de structure REST / GraphQL

Et de Sofien :

- les scénarios
- les mesures
- les observations
- les tableaux comparatifs

## C. Mise en récit analytique

Le travail doit répondre à des questions comme :

- dans quels cas REST est plus naturel ?
- dans quels cas GraphQL apporte un vrai gain ?
- quels gains sont réels et lesquels sont surtout théoriques ?
- quels coûts cachés apparaissent côté serveur ?
- dans le cadre de l’ERP, qu’est-ce qui ressort réellement ?

## D. Production des livrables finaux

Nathan devra probablement produire :

- la synthèse écrite
- les tableaux consolidés
- la logique comparative finale
- les slides ou le support oral
- la cohérence terminologique

## Ce qu’il doit exiger des deux autres

Nathan doit imposer un format de retour standard, sinon du temps sera perdu à reconstituer l’information.

Par exemple, chacun doit remettre :

- ce qu’il a fait
- ce qui marche
- ce qui ne marche pas
- ce qui reste incertain
- ce qui peut être montré
- ce qui peut être comparé proprement

## Critères de qualité pour Nathan

Le travail est bon si :

- la comparaison ne ressemble pas à une accumulation de résultats
- les conclusions sont nuancées
- les limites sont explicites
- le lien entre théorie et pratique est clair
- le lecteur comprend ce que le projet a réellement démontré
