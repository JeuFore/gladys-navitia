var Promise = require('bluebird');
var request = require('request');
const shared = require('../shared.js');

module.exports = function get(options){

	return new Promise(function(resolve, reject) {

		new Promise(function(origin, reject) {

			// Calcul de la position de départ

				gladys.location.getUser({id: 1})
				.then((location) => {

					origin(`${location.longitude};${location.latitude}`)

				})
		})
		.then((origin) => {

			if(!origin){
				return Promise.reject(new Error('AutoWakeUp : Localisation Gladys à échouée.')); 
			}

			new Promise(function(destination, reject) {

				// Calcul de la position d'arrivée

				gladys.calendar.getNextEventUser({id: 1})
				.then((event) => {

					event_date = event.start.getHours()*10000+event.start.getMinutes()*100

					to = event.location
					to = to.replace(/\s/g, "%20").replace(/,/g,"%2C").replace(/é/g,"%C3%A9")

					request('http://photon.komoot.de/api/?q='+to, function(err, result, body) {

						destination(`${(JSON.parse(body)).features[0].geometry.coordinates[0]};${(JSON.parse(body)).features[0].geometry.coordinates[1]}`)
					})
				})
			})
			.then((destination) => {

				if(!destination){
					return Promise.reject(new Error('AutoWakeUp : Aucune destination de spécifiée.')); 
				}

				// Vérification de l'utilisation de coverage

				var url = 'https://'+shared.api+'@api.navitia.io/v1/journeys?from='+origin+'&to='+destination+'&first_section_mode[]='+options.mode+'&min_nb_journeys=10&'

				if (options.coverage) {

					url = 'https://'+shared.api+'@api.navitia.io/v1/coverage/'+options.coverage+'/journeys?from='+origin+'&to='+destination+'&first_section_mode[]='+options.mode+'&min_nb_journeys=10&'
				}

				// Requête auprès de l'API Navitia

				request(url, function(err, response, body) {

					result = JSON.parse(body)
					console.log(result)

					if(result.error){
						console.log("erreur")
						reject(new Error('AutoWakeUp : Aucune réponse.')); 
					}

					var arrival
					n=11;

					while (!arrival) {
						n--					
						arrival = result.journeys[n]
					  }

					arrival = result.journeys[n].arrival_date_time.split("T")[1]

					while ((event_date < arrival) && (n !== 0)){
					    n--
						arrival = result.journeys[n].arrival_date_time.split("T")[1]
					}

					depart = result.journeys[n].departure_date_time.split("T")[1]

					// Affichage du départ et de l'arrivée

					let totalSeconds = result.journeys[n].duration
					let min = result.journeys[n].duration %= 3600

					var duration = {
						"hours" : Math.floor(totalSeconds / 3600),
						"minutes" : Math.floor(min / 60),
						"seconds" : min % 60
					}
					
					minutes = (depart.slice(2,4)) - options.time
					hours = 0

					if(minutes < 0){
						minutes = minutes+60
						hours++
					}

					var data = {
						"origin" : origin,
						"destination" : destination,
						"url" : url,
						"reveil" : {
							"hours" : (depart.slice(0,2))-hours,
							"minutes" : minutes,
							"seconds" : depart.slice(4,6)
						},
						"depart" : {
							"hours" : depart.slice(0,2),
							"minutes" : depart.slice(2,4),
							"seconds" : depart.slice(4,6)
						},
						"arrive" : {
							"hours" : arrival.slice(0,2),
							"minutes" : arrival.slice(2,4),
							"seconds" : arrival.slice(4,6)
						},
						"distance" : result.journeys[n].distances,
						"duration" : duration
					}

			   		resolve(data)
				});
			})
		})
	})
}