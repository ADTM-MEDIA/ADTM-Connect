# Contrat du futur workflow n8n

Ce document décrit le comportement attendu. Aucun workflow n8n opérationnel n'est fourni à ce stade.

## Déclencheur

Détecter dans `BIENS` un enregistrement réunissant :

- `STATUT_BIEN = actif` ;
- `ETAT_GENERATION = a_generer` ;
- référence, nom et URL renseignés ;
- aucun traitement déjà `en_cours` pour le même support.

## Séquence cible

1. Lire et normaliser le bien.
2. Valider le bien avec `schemas/bien.schema.json`.
3. Vérifier l'unicité de la référence et du support.
4. Construire `ID_SUPPORT`, `CODE_SOURCE` et `URL_DESTINATION`.
5. Créer ou versionner la ligne `SOURCES_QR_NFC`.
6. Passer le bien et le support à `en_cours`.
7. Appeler le futur générateur avec un objet conforme à `schemas/support.schema.json`.
8. Valider sa réponse avec `schemas/generation-result.schema.json`.
9. Enregistrer les URLs, la version et la date de génération.
10. Relier le support principal au bien.
11. Ajouter une ligne d'historique.
12. Passer le traitement à `terminee` et le support à `actif`.
13. Notifier Lucas avec les liens utiles.

## Gestion des erreurs

- journaliser l'étape, le code et le message d'erreur ;
- passer le traitement et le support à `erreur` ;
- ne supprimer aucun fichier ou lien précédemment valide ;
- empêcher les doublons lors d'une reprise ;
- exiger une nouvelle demande explicite avant régénération.

## Idempotence

La clé logique est `{ID_SUPPORT}:{VERSION}`. Une reprise avec la même clé doit mettre à jour la même tentative ou s'arrêter si elle a déjà réussi. Elle ne doit jamais créer un second support actif identique.

## Notification Lucas

Le canal initial envisagé est Telegram, puis WhatsApp. Le message contiendra au minimum le nom du bien, la référence Proj'est, l'identifiant support, le statut et le lien du PDF d'impression. Les coordonnées et jetons ne seront jamais stockés dans GitHub.

## Hors périmètre actuel

- fichier JSON exporté depuis n8n ;
- credentials Airtable, Telegram ou WhatsApp ;
- nœuds exécutables ;
- appels au générateur ;
- notification réelle.
