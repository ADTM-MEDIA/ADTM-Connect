# Airtable — modèle V2

Les noms techniques ci-dessous sont stables. Les libellés d'interface peuvent être traduits sans modifier les clés échangées avec les futurs services.

## Table `BIENS`

| Champ | Type Airtable | Obligatoire | Règle |
|---|---|---:|---|
| `REFERENCE_PROJEST` | Texte sur une ligne | Oui | Unique, majuscules, ex. `VA1928` |
| `NOM_BIEN` | Texte sur une ligne | Oui | Nom lisible du bien |
| `URL_ANNONCE` | URL | Oui si actif | URL HTTPS Proj'est |
| `STATUT_BIEN` | Sélection unique | Oui | `brouillon`, `actif`, `inactif`, `archive` |
| `IDENTIFIANT_PANNEAU` | Formule | Oui | Référence + `-PA01` |
| `QR_ASSOCIE` | Lien vers `SOURCES_QR_NFC` | Non | Un support panneau principal au maximum |
| `DATE_GENERATION` | Date avec heure | Non | Dernière génération réussie |
| `ETAT_GENERATION` | Sélection unique | Oui | `non_demandee`, `a_generer`, `en_cours`, `terminee`, `erreur` |
| `MESSAGE_ERREUR` | Texte long | Non | Dernier diagnostic exploitable |
| `DATE_CREATION` | Date de création | Auto | Audit |
| `DATE_MODIFICATION` | Dernière modification | Auto | Détection future |

Formule indicative de `IDENTIFIANT_PANNEAU` :

```text
IF({REFERENCE_PROJEST}, UPPER({REFERENCE_PROJEST}) & "-PA01")
```

## Table `SOURCES_QR_NFC`

| Champ | Type Airtable | Obligatoire | Règle |
|---|---|---:|---|
| `ID_SUPPORT` | Texte sur une ligne | Oui | Unique et immuable |
| `TYPE_SUPPORT` | Sélection unique | Oui | Valeur de `config/support-types.json` |
| `BIEN_ASSOCIE` | Lien vers `BIENS` | Selon type | Obligatoire pour un panneau de bien |
| `URL_DESTINATION` | URL | Oui | URL HTTPS ADTM contenant `src` |
| `CODE_SOURCE` | Texte sur une ligne | Oui | Identique à `ID_SUPPORT` |
| `STATUT_SUPPORT` | Sélection unique | Oui | `a_generer`, `en_cours`, `actif`, `inactif`, `erreur`, `archive` |
| `VERSION` | Nombre entier | Oui | Commence à 1 |
| `QR_SVG_URL` | URL | Après succès | Fichier maître QR |
| `QR_PNG_URL` | URL | Après succès | Aperçu QR |
| `ETIQUETTE_SVG_URL` | URL | Pour panneau | Fichier maître étiquette |
| `PDF_IMPRESSION_URL` | URL | Pour panneau | PDF prêt à imprimer |
| `DATE_GENERATION` | Date avec heure | Après succès | Dernière génération réussie |
| `HISTORIQUE` | Lien multiple | Non | Vers `HISTORIQUE_GENERATIONS` |
| `MESSAGE_ERREUR` | Texte long | Non | Dernier diagnostic |

## Table `HISTORIQUE_GENERATIONS`

| Champ | Type Airtable | Règle |
|---|---|---|
| `ID_EXECUTION` | Texte sur une ligne | Unique |
| `ID_SUPPORT` | Lien vers `SOURCES_QR_NFC` | Support traité |
| `BIEN_ASSOCIE` | Lien vers `BIENS` | Facultatif selon le support |
| `EVENEMENT` | Sélection unique | `creation`, `regeneration`, `desactivation`, `reactivation`, `erreur` |
| `VERSION` | Nombre entier | Version concernée |
| `STATUT_EXECUTION` | Sélection unique | `succes`, `erreur` |
| `FICHIERS_GENERES` | Texte long structuré | URLs produites, sans secret |
| `DETAIL_ERREUR` | Texte long | Diagnostic |
| `DATE_EXECUTION` | Date avec heure | Horodatage UTC |
| `DECLENCHE_PAR` | Sélection unique | `airtable`, `n8n`, `manuel` |

## Conditions de déclenchement futures

Un bien est éligible uniquement si `STATUT_BIEN = actif`, `ETAT_GENERATION = a_generer`, et si référence, nom et URL sont valides. La référence et l'identifiant du support doivent être uniques.
