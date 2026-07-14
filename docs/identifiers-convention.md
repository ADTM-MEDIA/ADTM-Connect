# Conventions d'identifiants V2

## Règles générales

- caractères autorisés : `A-Z`, `0-9` et tiret ;
- aucune espace, accent ou caractère spécial ;
- identifiants enregistrés en majuscules ;
- identifiant immuable après création ;
- le numéro possède toujours deux chiffres.

## Référence du bien

La référence Proj'est reste la référence métier, par exemple `VA1928`.

## Identifiant du support

Format :

```text
{REFERENCE_PROJEST}-{PREFIXE_TYPE}{NUMERO}
```

Exemples :

- `VA1928-PA01` : premier panneau du bien VA1928 ;
- `VA1928-ST01` : premier sticker rattaché au bien ;
- `VA1928-CA01` : première carte NFC rattachée au bien.

Les préfixes officiels sont définis dans `config/support-types.json`.

## URL destination

Format cible pour un bien :

```text
https://adtm-media.github.io/ADTM-Connect/bien/{REFERENCE_PROJEST}/?src={ID_SUPPORT}
```

Exemple :

```text
https://adtm-media.github.io/ADTM-Connect/bien/VA1928/?src=VA1928-PA01
```

`src` doit être strictement identique à `ID_SUPPORT`. L'URL encodée reste une URL ADTM stable ; la redirection métier pourra changer sans réimprimer le support.

## Version des livrables

Format de base :

```text
{ID_SUPPORT}-v{VERSION}
```

Exemple : `VA1928-PA01-v1`. Une nouvelle génération incrémente la version. Elle ne remplace pas silencieusement une version antérieure.

## Compatibilité V1

`LW001-ST01` reste valide comme identifiant historique Lucas. La V2 n'impose aucune migration ni renommage de cet identifiant.
