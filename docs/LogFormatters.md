# [AwesomeLog](../README.md) > Log Formatters

A Log Formatter is responsible for taking a raw log entry object and converting it into a string log message, which a Log Writer can output.  Each Log Writer can have its own Log Formatter allowing different writers to produce different formatted messages.

## Using Log Formatters

Log Formatters are configured against a specific Log Writer when you configure the Log Writer itself.  Here's an example:

```
Log.init({
	writers: [{
		name: "MyFileWriter",
		type:  "file",
		levels: "*",
		formatter: "json",
		options: {
		}
	}]
});
```

In this case we are telling our File Writer to use the `json` formatter.

## Built-In Log Formatters

AwesomeLog ships with four built-in Log Formatters:

 - **Default**: The default formatter outputs log messages in AwesomeLog's own custom format.  This includes the timestamp, the process id, the log level, the log system name, the log message, and any additional arguments.

	```
	2018-09-10T15:46:27.714Z : #1234 : INFO       : AwesomeLog       : Log initialized.
	2018-09-10T15:46:27.716Z : #1234 : INFO       : AwesomeLog       : Log started.
	```

 - **JSON**: The JSON formatter writes the entire log message out as a json string. You'll notice that there is a lot more detail in this example when compared with the one for `default` from above. Formatters often reduce the amount of log information.

	```
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log initialized.","args":[],"timestamp":1536594573580}
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log started.","args":[],"timestamp":1536594573582}
	```

 - **CSV**: The CSV formatter outputs the log information in a CSV format friendly to spreadsheets. The CSV format is `timestamp(unix epoch),level,pid,system name,message,arg0,arg1,...arg9999`.

 	```
	1536594995710,"INFO",19848,"AwesomeLog","Log initialized."
	1536594995712,"INFO",19848,"AwesomeLog","Log started."
	```

 - **JS**: The JS formatter outputs the log information as a JavaScript Object. It is more suited to programatic uses then to human readable usage.

	```
	[object Object]
	[object Object]
	```

## Writing a Custom Log Formatter

AwesomeLog strives to be highly configurable. As such, you are completely able to add your own formatters to AwesomeLog.

A custom formatter has the following shape, taken from our example [ExampleCustomFormatter](./examples/ExampleCustomFormatter) class:

```
"use strict";

const Log = require("AwesomeLog");
const LogFormatter = Log.LogFormatter;

class MyExampleFormatter extends LogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		let msg = "";

		msg += "#"+logentry.pid+"";
		msg += " : ";
		msg += new Date(logentry.timestamp).toISOString();
		msg += " : ";
		msg += logentry.system;
		msg += " : ";
		msg += logentry.level.name;
		msg += " : ";
		msg += logentry.message;

		return msg;
	}
}

Log.defineFormatter("my-example-formatter",MyExampleFormatter)
```

First, we require `AwesomeLog` and `AwesomeLog.LogFormatter`.

Next, we create our `MyExampleLogFormatter` class by extending `LogFormatter`.

In our class we are required to implement two methods:

 - **`constructor()`**: Where you can do some early initialization as required.

 - **`format(logentry)`**: The `format(logentry)` gets a `logentry` object that has a number of [different keys](#log-entry-keys) about the log message.  It returns a string (or otherwise) formatted message, like in our example.

 Finally, once our new LogFormatter class is set, we call `defineFormatter(typeName,logWriter)` to tell AwesomeLog about it.  `defineFormatter(formatterName,logFormatter)` take two arguments, the first the `formatterName` is the string value to be used to reference the formatter in the `formatter` setting, and second the `logFormatter` is the formatter class we just defined (not an instance of the class) to call when the formatter is used.

 After `defineWriter` is called, one can use the writer in `Log.init()`.

## Log Entry Keys

Each Log Entry that a formatter receives is an object with a dozen or so key/values in it. These are the properties that are available to you when creating a custom formatter for formatting the message. It is highly recommended that if a key/value pair is provided that you use that value instead of trying to compute it otherwise, especially if you are using Child Processes or the like.

Below is a list of the keys provided:

 - **timestamp**: The time (unix epoch) this log message wasa generated.
 - **level**: The Log Level of this log message. (This may be a Log Level object or a string.)
 - **system**: The System that was passed to the log message call, or the source file it was called from.
 - **message**: The log message itself.
 - **args**: Any addition log message arguments passed in.<br/><br/>
 - **hostname**: The FQDN hostname of the machine.
 - **domain**: The domain name (last two segments of the FQDN).
 - **servername**: The server name (the first segment of the FQDN).
 - **pid**: The process id.
 - **ppid**: The parent process id.
 - **main**: The main nodejs script that was executed when nodejs was started, if any.
 - **arch**: The hardware architecture. See nodejs' `os.arch()`.
 - **platform**: The OS platform. See nodejs' `os.platform()`.
 - **bits**: The OS bits, extrapolated from the OS platform.
 - **cpus**: The number of CPUs in the system.
 - **argv**: The original argv command line arguments passed when nodejs was started.
 - **execPath**: The executable to nodejs.
 - **startingDirectory**: The starting current working directory. This is not the same as the current working directory as the current working directory can change during execution.
 - **homedir**: The user's home directory.
 - **username**: The user's username, if any.
 - **version**: The nodejs version string.