module.exports = function (sails) {

	var init = require('./lib/init.js');
    var exec = require('./lib/API/exec.js');
    var geocoding = require('./lib/API/geocoding.js');
    var AutoWakeUp = require('./lib/API/AutoWakeUp.js');

    gladys.on('ready', function(){
        init().catch(sails.log.warn);
    });
    
    return {
        exec,
        geocoding,
        AutoWakeUp
    };
};
