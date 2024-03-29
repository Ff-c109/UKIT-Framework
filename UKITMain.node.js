const fs = require("fs");
const http = require("http");

const httpServer = http.createServer();

let Module = class Module {
	constructor(arg) {
		this.argstr = arg;
		this.exportsArg = "[EMPTY]";
	}
	getArg(key) {
		try {
			this.argstr.split('&');
		}
		catch {
			return null;
		}
		var tNode = "";
		var nodes = this.argstr.split('&').length;
		for(var i = 0; i < nodes; i++)
			if(this.argstr.split('&')[i].split('=')[0] == key) {
				return this.argstr.split('&')[i].split('=')[1];
			}
		return null;
	}
	export(key, value) {
		if(this.exportsArg == "[EMPTY]")
			this.exportsArg = key + '=' + value;
		else {
			var finded = false;
			var newstr = " ";
			for(var i = 0; i < this.exportsArg.split('&').length; i++) {
				if(this.exportsArg.split('&')[i].split('=')[0] == key) {
					finded = truee;
					if(newstr == " ")
						newstr = this.exportsArg.split('&')[i].split('=')[0] + '=' + value;
					else
						newstr += '&' + this.exportsArg.split('&')[i].split('=')[0] + '=' + value;
				}
				else {
					if(newstr == " ")
						newstr = this.exportsArg.split('&')[i];
					else
						newstr += '&' + this.exportsArg.split('&')[i];
				}
			}
			if(!finded) {
				if(newstr == " ")
					newstr = key + '=' + value;
				else
					newstr += '&' + key + '=' + value;
			}
			this.exportsArg = newstr;
		}
	}
	getExports() {
		return this.exportsArg;
	}
};
var on_request = (request, response) => {
	console.log("onRequest");
	var path = request.url.toString().substring(1, request.url.toString().length);
	var argstr = path.split('?')[1];
	path = path.split('?')[0];
	if(request.url.toString().split('?')[0] == "/")
		path = "index.upage";
	let framework = new Module(argstr);
 	fs.readFile(path, (err, data) => {
		if(err) {
			response.write(err.toString());
			response.end();
			console.log(err);
		}
		else {
			console.log("file loaded");
			if(path.split('.')[path.split('.').length - 1] == "upage" || (path.split('.')[path.split('.').length - 2] == "upage" && path.split('.')[path.split('.').length - 1] == "html")) {
				console.log("ukit loading");
				response.setHeader("Content-Type", "text/html;charset=utf8");
				var tstring = '<upageCode>';
				for(var i = 0; i < data.toString().length - tstring.length; i++) {
					if(data.toString().substring(i, i + tstring.length) == tstring) {
						var loc = i;
						loc += tstring.length;
						tstring = '</upageCode>'
						for(var j = 0; j < data.toString().length - tstring.length; j++) {
							if(data.toString().substring(j, j + tstring.length) == tstring) {
								var eloc = j;
								j--;
								var execUKIT = () => {
									console.log("execute upageCode");
									var tfunc = require("./" + path + ".ukitcache.js");
									var tFuncRet = tfunc.onGet(framework);
									//if(tFuncRet === "UKIT") {
										//response.write(data.toString().substring(0, loc - tstring.length + 1) + "<script>var retv=" + '"' + tFuncRet + '"</script>' + data.toString().substring(eloc + tstring.length + 1, data.toString().length));
										//response.end();
									//}
									//else {
									console.log("exec done.");
										response.write(data.toString().substring(0, loc - tstring.length + 1) + "<script>" + fs.readFileSync("ukitforground.js") + "\nlet framework = new Module(\'" + framework.getExports().replace(/'/g, "\\\'").replace(/\n/g, "\\n") + "\');" + "</script>" + data.toString().substring(eloc + tstring.length, data.toString().length));
										response.end();
									//}

								};
								fs.readFile(path + ".ukitcache.js", (err, code) => {
									if(code != data.toString().substring(loc, eloc) + "\n" + 'module.exports = {onGet}') {
										console.log("loading upageCode");
										fs.writeFile(path + ".ukitcache.js", data.toString().substring(loc, eloc) + "\n" + 'module.exports = {onGet}', () => {
											execUKIT();
										});
									}
									else {
										console.log("loading upageCode from cache");
										execUKIT();
									}
								});
								break;
							}
						}
						break;
					}
				}
			}
			else {
				console.log("return file");
				response.write(data);
				response.end();
			}
		}
	});
};

var ip_addr_bind = [ "Error" ];

if(fs.readFileSync("address-bind.conf").toString().split('\n')[0] == "# enable")
    ip_addr_bind = fs.readFileSync("address-bind.conf").toString().split('\n')[1].split(',');
else if(fs.readFileSync("address-bind.conf").toString().split('\n')[0] == "# disable")
    ip_addr_bind = [ "Disable" ];

if(ip_addr_bind[0] == "Error")
    throw("address-bind.conf: File type error.");

var servers = [ "" ];
var port = parseInt(fs.readFileSync("port.conf").toString().split('\n')[0]);
const startServer = () => {
    var req = http.request({hostname: "::1", port: port.toString(), path: "/", method: "GET"}, (res) => {
        port++;
        startServer();
    });
    req.on('error', e => {
        if(e.code.toString() != "ECONNREFUSED") {
            port++;
            startServer();
        }
        else {
            console.log("start server");
            console.log(port);
            ip_addr_bind[0] == "Disable" ? true : console.log("Ip address binding enabled");
            if(ip_addr_bind[0] != "Disable") {
                for(var i = 0; i < ip_addr_bind.length; i++) {
                    servers[i] = http.createServer();
                    servers[i].on('request', on_request);
                    servers[i].listen({ host: ip_addr_bind[i], port: port });
                }
            }
            else {
				servers[0] = http.createServer();
				servers[0].on("request", on_request);
				servers[0].listen(port);
			}
        }
    });
    req.end();
};
startServer();
const stopServer = () => {
	servers.forEach(element => {
		element.close();
	});
};

var port1 = port + 1;
var stopService = "";
const startStopService = () => {
	var req = http.request({hostname: "::1", port: port1.toString(), path: "/", method: "GET"}, (res) => {
        port1++;
        startStopService();
    });
    req.on('error', e => {
        if(e.code.toString() != "ECONNREFUSED") {
            port1++;
            startStopService();
        }
        else {
            console.log("shutdown: http://[::1]:" + port1 + "/exit");
            stopService = http.createServer();
			stopService.on('request', (req, res) => {
				if(req.url == "/exit") {
					res.end();
					console.log("shutting down...");
					stopServer();
					stopService.close();
				}
				else {
					res.end();
				}
			});
			stopService.listen(port1);
        }
    });
    req.end();
};
startStopService();

