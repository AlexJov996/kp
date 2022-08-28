'use strict';

const {to} = require('await-to-js');
const pe = require('parse-error');

module.exports.to = async (promise) => {
    const [err, res] = await to(promise);
    return err ? [pe(err)] : [null, res];
};

module.exports.ReE = function(res, err, code){ // Error Web Response
    if(typeof err === 'object' && typeof err.message !== 'undefined'){
        err = err.message;
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json({success:false, error: err});
};

module.exports.ReS = function(res, data, code){ // Success Web Response
    let send_data = {success:true};

    if(typeof data === 'object'){
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};

module.exports.TE = function(err_message, log){ // TE stands for Throw Error
    if(log === true){
        console.error(err_message);
    }

    throw new Error(err_message);
};

module.exports.TERR = function(err_message, err){ // TE stands for Throw Error
    console.error(err_message, err);
    throw new Error(err);
};

module.exports.ELAPSED = function(elapsedHrTime) {
    let elapsed = process.hrtime(elapsedHrTime);
    elapsed = Math.floor((elapsed[0] * 1000) + (elapsed[1] / 1000000));
    return elapsed;
};

