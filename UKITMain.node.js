const fs = require("fs");
const http = require("http");

const httpServer = http.createServer();

httpServer.listen(fs.readFileSync("port.conf").toString().split('\n')[0], () => {
	console.log(fs.readFileSync("port.conf").toString().split('\n')[0]);
});

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
	exports(key, value) {
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
httpServer.on('request', (request, response) => {
	var path = request.url.toString().substring(1, request.url.toString().length);
	var argstr = path.split('?')[1];
	path = path.split('?')[0];
	if(request.url.toString().split('?')[0] == "/")
		path = "index.upage";
	let module = new Module(argstr);
 	fs.readFile(path, (err, data) => {
		if(err) {
			response.write(err.toString());
			response.end();
		}
		else {
			console.log("file loaded");
			if(path.split('.')[path.split('.').length - 1] == "upage") {
				console.log("ukit loading");
				response.setHeader("Content-Type", "text/html;charset=utf8");
				var tstring = '<upageCode>';
				console.log('searching');
				for(var i = 0; i < data.toString().length - tstring.length; i++) {
					if(data.toString().substring(i, i + tstring.length) == tstring) {
						console.log("finded");
						var loc = i;
						loc += tstring.length;
						tstring = '</upageCode>'
						console.log("searching");
						for(var j = 0; j < data.toString().length - tstring.length; j++) {
							if(data.toString().substring(j, j + tstring.length) == tstring) {
								console.log("finded");
								var eloc = j;
								j--;
								fs.writeFile(path + ".ukitcache.js", data.toString().substring(loc, eloc) + "\n" + 'module.exports = {onGet}', () => {
									var tfunc = require("./" + path + ".ukitcache.js");
									var tFuncRet = tfunc.onGet(module);
									console.log(module.getExports());
									//if(tFuncRet === "UKIT") {
										//response.write(data.toString().substring(0, loc - tstring.length + 1) + "<script>var retv=" + '"' + tFuncRet + '"</script>' + data.toString().substring(eloc + tstring.length + 1, data.toString().length));
										//response.end();
									//}
									//else {
										response.write(data.toString().substring(0, loc - tstring.length + 1) + "<script>" + fs.readFileSync("ukitforground.js") + "\nlet module = new Module(\"" + module.getExports() + "\");" + "</script>" + data.toString().substring(eloc + tstring.length, data.toString().length));
										console.log(data.toString().substring(0, loc - tstring.length + 1) + "<script>" + fs.readFileSync("ukitforground.js") + "\nlet module = new Module(\"" + module.getExports() + "\");" + "</script>" + data.toString().substring(eloc + tstring.length, data.toString().length));
										response.end();
									//}
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
});
