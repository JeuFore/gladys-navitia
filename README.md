# gladys-navitia

## Pré-requis

Nécessite Gladys >= 3.0.0.

## Installation

* Créer une clé API sur le site de Navitia :
https://www.navitia.io/register/
* Installer le module dans le store sur Gladys.
* Créer dans les paramètres de Gladys une clé qui s’appellera NAVITIA_API_KEY, et à coté on y ajoute la clé API que vous avez obtenus sur le site
* Rebooter Gladys.

## Utilisation

Dans un script, nous pouvons écrire :

```javascript
var options = {
    origin : "17 rue de l'aérostation maritime 78210 Saint Cyr L'école" ,
    destination : '23 Place Wicklow Montigny-Le-Bretonneux 78180',
    network : 'stavo',
    line : '51',
    departure : '13:06',
};

gladys.modules.navitia.exec(options)
.then((result) => {
    console.log(result);
});
```

* Origin ------------- (Optionnel)
* Destination ------------- (Obligatoire)
* Departure ------------- (Optionnel)
* Arrival ------------- (Optionnel)
* First_mode ------------- (§)
* Last_mode ------------- (§)
* Network ------------- (Optionnel)
* Line ------------- (Optionnel)
* Number ------------- (Optionnel).

* § Obligatoire dans le cas où vous êtes à plus de 30m à pied d’un arrêt de transport en commun.