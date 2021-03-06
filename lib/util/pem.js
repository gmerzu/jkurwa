'use strict;'

var Buffer = require('buffer').Buffer;
var b64_decode = require('./base64.js').b64_decode;

var is_pem = function (indata) {
    if (indata.constructor === Uint8Array || Buffer.isBuffer(indata)) {
        if ((indata[0] === 0x2D) &&
                (indata[1] === 0x2D) &&
                (indata[2] === 0x2D) &&
                (indata[3] === 0x2D) &&
                (indata[4] === 0x2D)) {
            return true;
        }
    }
    if ((typeof indata) === 'string') {
        return indata.indexOf('-----') === 0;
    }
};

var from_pem = function (indata) {
    var start, end, ln;
    if ((typeof indata) !== 'string') {
        indata = String.fromCharCode.apply(null, indata);
    }
    indata = indata.split('\n');
    for (start = 0; start < indata.length; start++) {
        ln = indata[start];
        if (ln.indexOf('-----') === 0) {
            start++;
            break;
        }
    }

    for (end = 1; end <= indata.length; end++) {
        ln = indata[indata.length - end];
        if (ln.indexOf('-----') === 0) {
            break;
        }
    }

    indata = indata.slice(start, -end).join('');
    return b64_decode(indata);
};

var maybe_pem = function (indata) {
    if (is_pem(indata)) {
        return from_pem(indata);
    } 
        
    return indata;
};

module.exports = {
    from_pem: from_pem,
    is_pem: is_pem,
    maybe_pem: maybe_pem,
};
