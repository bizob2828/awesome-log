// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("AbstractLogFormatter",()=>{
	beforeEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	afterEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	it("csv formatter",function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "csv"
		});

		Log.start();

		Log.info("Testing formatting...");
		Log.info("Testing formatting...",123);
		Log.info("Testing formatting...",123,"abc");
		Log.info("Testing formatting...",123,"abc",[456,"def"]);
		assert(Log.history[0].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting..."$/));
		assert(Log.history[1].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123$/));
		assert(Log.history[2].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc"$/));
		assert(Log.history[3].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc","\[456,\\"def\\"\]"$/));

		Log.stop();
	});
});