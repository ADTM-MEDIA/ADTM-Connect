# ADTM Connect V2 — Architecture de fondation

## Objectif

Transformer le prototype statique Lucas en un système automatisable, sans modifier la V1. Cette étape fige uniquement les contrats de données et les conventions. Elle n'implémente ni générateur, ni workflow n8n, ni production de fichiers graphiques.

## Principes

- Airtable est la source de vérité métier.
- `BIENS` porte les informations immobilières.
- `SOURCES_QR_NFC` porte chaque support physique et son cycle de vie.
- `HISTORIQUE_GENERATIONS` conserve une trace immuable des traitements.
- Un QR/NFC pointe toujours vers une URL ADTM contrôlée, jamais directement vers l'annonce Proj'est.
- Les identifiants sont stables ; une régénération incrémente la version sans réutiliser un ancien fichier.
- Un échec ne supprime jamais la dernière version valide.

## Composants cibles

1. Airtable détecte un bien actif prêt à être généré.
2. Le futur orchestrateur valide les données et crée le support.
3. Le futur générateur produit successivement QR SVG, aperçu PNG, étiquette SVG et PDF d'impression.
4. Les URL et statuts sont réécrits dans Airtable.
5. L'exécution est journalisée puis Lucas est notifié.

## Contrats

- Entrée bien : `schemas/bien.schema.json`
- Entrée support : `schemas/support.schema.json`
- Sortie génération : `schemas/generation-result.schema.json`
- Types et préfixes : `config/support-types.json`
- Réglages QR : `config/qr-presets.json`
- Réglages d'impression : `config/print-presets.json`

## États

### Bien

`brouillon` → `actif` → `inactif` → `archive`

### Génération

`non_demandee` → `a_generer` → `en_cours` → `terminee`

En cas d'échec : `en_cours` → `erreur`, puis retour explicite à `a_generer`.

### Support

`a_generer` → `en_cours` → `actif` → `inactif` → `archive`

## Hors périmètre de cette fondation

- scripts de génération ;
- QR, PNG, SVG d'étiquette, PDF ou autres assets ;
- modèle graphique final ;
- export n8n opérationnel ;
- secrets ou identifiants Airtable ;
- modification de `lucas-werny/` ou des fichiers V1 validés.
