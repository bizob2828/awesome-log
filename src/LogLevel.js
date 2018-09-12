// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $NAME = Symbol("name");

/**
 * Class for holding LogLevel names and it associated needs.
 */
class LogLevel {
	/**
	 * @constructor
	 * @param {string} name 
	 */
	constructor(name) {
		if (!name) throw new Error("Missing name argument.");
		if (typeof name!=="string") throw new Error("Invalid name argument");

		name = name.replace(/[^\w\d_]/g,""); // strip out any non variables friendly characters.

		this[$NAME] = name.toUpperCase();
	}

	/**
	 * Return the LogLevel name, as a string. All upper case.
	 *
	 * @return {string} 
	 */
	get name() {
		return this[$NAME];
	}

	/**
	 * Returns the LogLevel object as JSON string, which is just the name.
	 *
	 * @return {string} 
	 */
	toJSON() {
		return this.name;
	}
}

module.exports = LogLevel;
