/**
 * Script de Seeding pour Strapi.
 */

const NB_CLIENTS = 150;
const NB_PRODUITS = 100;
const MAX_COMMANDES_PAR_CLIENT = 3;
const MAX_LIGNES_PAR_COMMANDE = 7;
const CHANCE_OF_OF = 0.6; // 70% chance a line item gets an OrdreDeFabrication
const MAX_TACHES_PAR_OF = 5;
const MAX_NOMENCLATURES_PAR_PRODUIT = 3;

// --- Fonctions Utilitaires ---
const randomString = (length) => Math.random().toString(36).substring(2, 2 + length);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function seed() {
  const app = strapi;
  console.log('--- DÉBUT DU SEEDING COMPLET ---');

  try {
    // 1. --- VIDAGE DES DONNÉES ---
    console.log('Étape 1: Vidage des données existantes...');

    // L'ordre est important (des enfants vers les parents)
    const collectionsToClear = [
      'api::tache.tache',
      'api::ordre-de-fabrication.ordre-de-fabrication',
      'api::nomenclature.nomenclature',
      'api::ligne-commande.ligne-commande',
      'api::commande.commande',
      'api::client.client',
      'api::produit.produit'
    ];

    for (const uid of collectionsToClear) {
      try {
        const entries = await app.db.query(uid).findMany({ select: ['documentId'] });

        const uniqueDocIds = [...new Set(entries.map(e => e.documentId).filter(Boolean))];

        for (const docId of uniqueDocIds) {
          await app.documents(uid).delete({ documentId: docId });
        }

        if (uniqueDocIds.length > 0) {
          console.log(`✅ Nettoyage de ${uid} : ${uniqueDocIds.length} documents supprimés.`);
        }
      } catch (err) {
        console.log(`⚠️ Ignoré : ${uid} (La collection n'existe peut-être pas encore)`);
      }
    }
    console.log('Données vidées avec succès.');
    await delay(500);

    // 2. --- CRÉATION DES PRODUITS ---
    console.log(`Étape 2: Création de ${NB_PRODUITS} produits...`);
    const products = [];
    for (let i = 0; i < NB_PRODUITS; i++) {
      const product = await app.documents('api::produit.produit').create({
        data: {
          nom: `Produit ${randomString(10)}`,
          prix: randomFloat(10, 1000).toFixed(2),
          en_stock: randomInt(0, 500),
          type: randomElement(['Produit Fini', 'Matière Première']),
        },
        status: 'published',
      });
      products.push(product);
    }
    console.log(`${products.length} produits créés.`);
    await delay(100);

    // 3. --- CRÉATION DES NOMENCLATURES ---
    console.log('Étape 3: Création des nomenclatures...');
    let totalNomenclatures = 0;
    const produitsFinis = products.filter(p => p.type === 'Produit Fini');
    const matieresPremieres = products.filter(p => p.type === 'Matière Première');
    if (produitsFinis.length > 0 && matieresPremieres.length > 0) {
      for (const produitFini of produitsFinis) {
        const numNomenclatures = randomInt(1, MAX_NOMENCLATURES_PAR_PRODUIT);
        for (let i = 0; i < numNomenclatures; i++) {
          await app.documents('api::nomenclature.nomenclature').create({
            data: {
              quantite_requise: randomInt(1, 10),
              produit_fini_id: produitFini.documentId,
              matiere_premiere_id: randomElement(matieresPremieres).documentId,
            },
            status: 'published',
          });
          totalNomenclatures++;
        }
      }
    }
    console.log(`${totalNomenclatures} nomenclatures créées.`);
    await delay(100);

    // 4. --- CRÉATION DES CLIENTS ---
    console.log(`Étape 4: Création de ${NB_CLIENTS} clients...`);
    const clients = [];
    for (let i = 0; i < NB_CLIENTS; i++) {
      const client = await app.documents('api::client.client').create({
        data: {
          nom: `Client ${randomString(5)} ${randomString(8)}`,
          entreprise: `Entreprise ${randomString(12)}`,
          email: `${randomString(10)}@example.com`.toLowerCase(),
        },
        status: 'published',
      });
      clients.push(client);
    }
    console.log(`${clients.length} clients créés.`);
    await delay(100);

    // 5. --- CRÉATION DES COMMANDES, LIGNES, OFs ET TÂCHES ---
    console.log('Étape 5: Création des commandes, lignes, OFs et tâches... (TRES LONG !)');
    let totalOrders = 0, totalLines = 0, totalOfs = 0, totalTaches = 0;
    for (const client of clients) {
      const numOrders = randomInt(1, MAX_COMMANDES_PAR_CLIENT);
      for (let i = 0; i < numOrders; i++) {
        const commande = await app.documents('api::commande.commande').create({
          data: {
            client: client.documentId,
            date_commande: randomDate(new Date(2020, 0, 1), new Date()),
            statut: randomElement(['En cours', 'Livrée', 'Annulée']),
          },
          status: 'published',
        });
        totalOrders++;
        await delay(20);

        const numLines = randomInt(1, MAX_LIGNES_PAR_COMMANDE);
        for (let j = 0; j < numLines; j++) {
          const randomProduct = randomElement(products);
          const ligneCommande = await app.documents('api::ligne-commande.ligne-commande').create({
            data: {
              commande: commande.documentId,
              produit: randomProduct.documentId,
              quantite: randomInt(1, 50),
            },
            status: 'published',
          });
          totalLines++;
          await delay(20);

          // Create OrdreDeFabrication for this line item (optional)
          if (Math.random() < CHANCE_OF_OF) {
            const of = await app.documents('api::ordre-de-fabrication.ordre-de-fabrication').create({
              data: {
                reference: `OF-${randomString(8)}`,
                quantite_a_produire: randomInt(1, 100),
                date_lancement: randomDate(commande.date_commande, new Date()),
                statut: randomElement(['Planifié', 'En cours', 'Terminé']),
                produit_id: randomProduct.documentId,
                ligne_commande: ligneCommande.documentId,
              },
              status: 'published',
            });
            totalOfs++;
            await delay(20);

            const numTaches = randomInt(1, MAX_TACHES_PAR_OF);
            for (let k = 0; k < numTaches; k++) {
              await app.documents('api::tache.tache').create({
                data: {
                  description_tache: `Tache ${randomString(15)}`,
                  heures_passees: randomInt(1, 20),
                  ordre_de_fabrication: of.documentId,
                  employe_nom: `Employe ${randomString(5)}`,
                },
                status: 'published',
              });
              totalTaches++;
            }
          }
        }
      }
    }
    console.log(`Création terminée: ${totalOrders} commandes, ${totalLines} lignes, ${totalOfs} OFs, ${totalTaches} tâches.`);

    console.log('✅ Seeding terminé avec succès!');
  } catch (error) {
    console.error('❌ Une erreur est survenue pendant le seeding:', error);
  }
}

module.exports = {
  seed,
};
