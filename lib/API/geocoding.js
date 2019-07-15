var request = require('request');

module.exports = function(location){

  return new Promise(function(resolve, reject) {

    if(!location){
      gladys.location.getUser({id: 1})
      .then((location) => {
        return resolve(`${location.longitude};${location.latitude}`)
      })
    }

    location = location.replace(/\s/g, "%20").replace(/,/g,"%2C").replace(/é/g,"%C3%A9")

    request(`http://photon.komoot.de/api/?q=${location}`, function(err, result, body) {

      if(body == "<h1>Bad Message 400</h1><pre>reason: Bad Request</pre>")  return reject(`Navitia Error : check not to put special character (ex : É)`)
      
      body = JSON.parse(body)

      return resolve(`${body.features[0].geometry.coordinates[0]};${body.features[0].geometry.coordinates[1]}`)
      
    })
  })
}  