//varnish-can (works with varnish-brush) A status server for varnish.
var http = require('http');
var crypto = require('crypto');
// set up the sevrver resource state (r2) in protect mode
var r2 = 'noneshallpass';
var secret = require('./secret.js');
// using Events as a way to searalize js callbacks (ToDo: maybe use async.js)
var EE = require('events').EventEmitter;

var md5_hex = function(plain_txt) {
    var crypto_md5 = crypto.createHash('md5');
    crypto_md5.update(plain_txt);
    return crypto_md5.digest('hex');
};

var server = require('http').createServer(function (req, res) {
    var r1;
    var d;
    var e;
    // this server has two modes, first it replys to a request for a special url (a resource).
    // Secondly it responds to the special URL and returns data, otherwise 404 error.
    if (req.url === '/varnishstats' && r2 === 'noneshallpass') {
        d = new Date();
        // set up a new resource (r1) that will respond to a second request.
        r1 = md5_hex(d+secret.salt+Math.random());
        // next hash r1+password (this password is the public key).
        // the client will do this same operation to determine the resource to access.
        r2 = md5_hex(r1+secret.password);
        // reply with the public resource (r1)
        res.writeHead(200, {'Content-Type': 'plain/text'});
        res.end(r1);
        // r2 is a temporary resource... gets reset in a short time. 
        setTimeout(function() {r2 = 'noneshallpass';}, 5000);
        //console.log("varnish-can dip");
    }
    else if (req.url === '/'+r2 && r2 !== 'noneshallpass') {
        r2 = 'noneshallpass';
        e = new EE();
        // the stats data is compiled form 2 varnish utility calls...
        // A. varnishstat 
        // B. varnishtop
        e.on("A", function() {
            var exec = require('child_process').exec,
                child;
            var e = this; 
            var cmd = 'varnishstat -1 -f cache_hit,cache_miss,n_lru_moved,SMF.s0.g_space,SMF.s0.c_bytes,uptime';
            //console.log("varnish-can tap");

            child = exec(cmd, function (error, stdout, stderr) {
                var matches, i, match, name;
                var json_obj = {};
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                else {
                    matches=stdout.split(/\n/);
                    for (i = 0; i < matches.length; i+=1) {
                        match = /^([A-Z|a-z|0-9|_|\.]+)\s+(\d+)/i.exec(matches[i]);
                        if (match && match[1]) {
                            name = match[1].replace(/\./g, ":");
                            json_obj[name] = parseInt(match[2], 10);
                        }
                    }
                }
                e.emit("B", json_obj);
            });
        });
        e.on("B", function(json_obj) {
            var exec = require('child_process').exec,
                child;
            var e = this; 
            var cmd = 'varnishtop -i RxHeader -C -I ^Host -1';
            //console.log("varnish-can tap");

            child = exec(cmd, function (error, stdout, stderr) {
                // parse and emit
                var matches, i, match, name;
                var json_obj2 = {};
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                else {
                    //console.log(stdout);
                    matches=stdout.split(/\n/);

                    for (i = 0; i < matches.length; i+=1) {
                        match = /\s([0-9]+)\.00\sRxHeader\sHost\:\s([a-z|\.|\-|0-9]+)$/i.exec(matches[i]);
                        if (match && match[1]) {
                            name = match[2].replace(/\./g, ":");
                            json_obj2[name] = parseInt(match[1], 10);
                        }
                    }
                    //console.log("varnish-can wipe");
                    //console.log(JSON.stringify(json_obj2));
                    
                }                
                e.emit("End", {"stats":json_obj, "domains":json_obj2});
            });
            
        });
        e.on("End", function(out_obj) {
            //console.log("varnish-can drip");
            // TODO add in and test res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(out_obj));
            res.write('\n');
            res.end();
        });
        // LGTPS (lets get this party started)
        e.emit("A");
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("Page Not Found.");
    }
});

server.listen(8080);
console.log("varnish-can service listening on port 8080, noneshallpass");
