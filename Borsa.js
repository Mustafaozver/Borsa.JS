function Wallet() {
	this._ = {};
	for (var key in Wallet.Moneys) this._[Wallet.Moneys[key].getName()] = new Asset(Wallet.Moneys[key].getName());
}

Wallet.Moneys = {};
Wallet.getTotalParity = function(omet) {
	var total = 0;
	switch (omet) {
		default:
		case 0:
			for (var key in this.Moneys) total += (this.Moneys[key].parity**this.Moneys[key]._pwparity)*this.Moneys[key]._paritymult + this.Moneys[key]._epparity;// - (this.Moneys[key].parity - this.Moneys[key]._exparity);
		break;
		case 1:
			for (var key in this.Moneys) total += 1/((this.Moneys[key].parity**this.Moneys[key]._pwparity)*this.Moneys[key]._paritymult + this.Moneys[key]._epparity);// - (this.Moneys[key].parity - this.Moneys[key]._exparity));
		break;
	}
	return total;
};

Wallet.prototype.toString = function() {
	var text = "Wallet {";
	for (var key in Wallet.Moneys) text += "\n " + this._[Wallet.Moneys[key].getName()].getType() + ":" + this._[Wallet.Moneys[key].getName()].getValue() + "";
	return text + "\n}";
};

Wallet.prototype.getVpF = function(par) {
	var val = 0;
	for (var key in Wallet.Moneys) {
		if (this._[key]) val += this._[key].getVpF();
	}
	if (!par) return val;
	else return val/Wallet.Moneys[par].parity;
};

Wallet.prototype.buy = function(val, par) {
	par = par.toUpperCase();
	if (Wallet.Moneys[par]) {
		if (this._[par]) this._[par].buy(val,par);
	}
};

Wallet.prototype.sell = function(val, par) {
	par = par.toUpperCase();
	if (Wallet.Moneys[par]) {
		if (this._[par]) this._[par].sell(val,par);
	}
};

Wallet.prototype.getAssetValue = function(par) {
	par = par.toUpperCase();
	if (Wallet.Moneys[par]) {
		if (this._[par]) return this._[par].getValue();
	}
	return 0;
};

function Money(name,parity) {
	this.name = ""+name;
	this.parity = parity?parity:1;
	this._epparity = 0;
	this._pwparity = 1;
	this._paritymult = 1;
	this._exparity = this.parity;
	Wallet.Moneys[this.name] = this;
}

Money.prototype.getName = function() {
	return this.name;
};

Money.prototype.setParity = function(oPar,par2) {
	this._exparity = this.parity;
	this.parity = oPar*(par2?Wallet.Moneys[par2].parity:1);
};

function Asset(type) {
	this.type = ""+type;
	this.value = 0;
}

Asset.prototype.getType = function() {
	return this.type;
};

Asset.prototype.getValue = function() {
	return this.value;
};

Asset.prototype.asValue = function(oVal) {
	if (oVal) {
		this.value += +oVal;
		return oVal*Wallet.Moneys[this.type].parity;
	}
};

Asset.prototype.getVpF = function() {
	return this.value*Wallet.Moneys[this.type].parity;
};

Asset.prototype.buy = function(val, par) {
	if (!par) return this.asValue(val/Wallet.Moneys[this.type].parity);
	else if (Wallet.Moneys[par]) return this.asValue(val/Wallet.Moneys[this.type].parity*Wallet.Moneys[par].parity);
};

Asset.prototype.sell = function(val, par) {
	val *= -1;
	if (!par) return this.asValue(val/Wallet.Moneys[this.type].parity);
	else if (Wallet.Moneys[par]) return this.asValue(val/Wallet.Moneys[this.type].parity*Wallet.Moneys[par].parity);
	/*
	if (par) if (Wallet.Moneys[par]) value /= Wallet.Moneys[par].parity;
	return this.asValue(value);*/
};
