
		function onGet(framework) {
			var res = framework.getArg("display");
			var display = "";
			if(res != null)
				display = "\"" + res + "\"";
			else
				display = "[Empty]";
			var fs = require("fs");
			framework.newProcess("chproc_demo.js", "Hello, 你好, こんにちは, Здравствыйте", (retv) => {
				console.log("retv: " + retv);
				framework.export("display", display);
				framework.export("ch_proc", retv);
				framework.send();
			});
		}
	
module.exports = {onGet}