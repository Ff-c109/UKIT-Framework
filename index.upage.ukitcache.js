
		function onGet(framework) {
			var res = framework.getArg("display");
			if(res != null)
				framework.export("display", "\'" + res + "\'");
			else
				framework.export("display", "[Empty]");
		}
	
module.exports = {onGet}