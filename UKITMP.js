mp_port = process.env.UKITMP;
const http = require("http");
var querystring = require('querystring');
let Framework = class Framework {
	constructor(argv) {
		this.argv = argv;
		this.ready = false;
		this.onReady = null;
	}
	ret(retv) {
		var contents = querystring.stringify({
		    ret: retv,
		    action: 'return'
		});
		var options = {
		    host: 'localhost',
		    port: parseInt(mp_port),
		    path: '/ret',
		    method: 'POST',
		    headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': contents.length
		    }
		};
		var req = http.request(options, (rep) => {});
		req.write(contents);
		req.end();
	}
/*	onReady_daemon() {
		var check = () => {
			if(this.ready) {
				if(this.onReady == null)
					setTimeout(check, 0);
				else
					return this.onReady();
			}
			else {
				setTimeout(check, 0);
			}
		};
		check();
	}*/
};

let framework = new Framework("");

//framework.onReady_daemon();

http.get('http://localhost:' + mp_port + '/', (response) => {
  var argv = "";

  // called when a data chunk is received.
  response.on('data', (chunk) => {
    argv += chunk;
  });

  // called when the complete response is received.
  response.on('end', () => {
    framework.argv = argv;
//    framework.ready = true;
    framework.onReady();
  });

}).on("error", (error) => {
  console.log("Error: " + error.message);
});

