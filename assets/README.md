# ADTM Connect Assets

Ce dossier stocke les fichiers publics utilises par les supports ADTM Connect.

## Organisation

- `qrcode/` : QR codes sources, en PNG et SVG.
- `labels/` : visuels imprimables par agent et par support.

## Logique Airtable future

Airtable reste la source de verite metier. GitHub stocke les fichiers publics, et Airtable reference leurs URLs.

Table `Supports` prevue :

- Agent
- ID support
- Type support
- URL cible
- QR Code PNG
- QR Code SVG
- Statut actif/inactif
- Date creation

Exemple :

- Agent : Lucas Werny
- ID support : LW001-ST01
- Type support : Sticker telephone
- URL : https://adtm-media.github.io/ADTM-Connect/lucas-werny/?src=LW001-ST01
