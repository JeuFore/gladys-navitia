const shared = require('./shared.js');

module.exports = function init(){

	return gladys.param.getValue('NAVITIA_API_KEY')
	.then((api) => {
		shared.api = api
	})
}