let Module = class Module {
	constructor(content) {
		this.exportsArg = content;
	}
	read(key) {
		if(this.exportsArg == "[EMPTY]")
			return null;
		for(var i = 0; i < this.exportsArg.split('&').length; i++)
			if(this.exportsArg.split('&')[i].split('=')[0] == key)
				return this.exportsArg.split('&')[i].split('=')[1];
		return null;
	}
};

