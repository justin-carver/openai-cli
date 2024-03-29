const commander = require('commander');
const winston = require('winston');

commander
	.name('openai-cli')
	.version('0.2', '--version', 'Outputs the current verison number.')
	.description(
		'A simple, command-line Node.js wrapper for OpenAI built in JavaScript. Please visit the Github repository: https://github.com/justin-carver/openai-cli for more information on contributing and opening issues.'
	)
	.usage('[OPTIONS]...')
	.option(
		'-b, --beautify',
		"Formats the HTTP response from OpenAI's API to look beautiful. Note: 'p' was already taken by 'prompt', let alone 'prettier'.",
		false
	)
	.option(
		'-c, --config <string>',
		'Relative path to a config.json file that can be imported for settings.'
	)
	.option(
		'-d, --dalle <string>',
		'Queries the DALL-E endpoint for image generation using the supplied prompt.'
	)
	.option(
		'-e, --echo',
		'If echo is enabled, the prompt will be echoed back with the completion, regardless if command is verbose.'
	)
	.option(
		'-o, --output <string>',
		'Pipe the completion output into a non-formatted specific file. All entries are appended, not overwritten. File name is rotated daily.',
		`logs/output/${new Date()
			.toISOString()
			.replace(/T.*/, '')
			.split('-')
			.join('-')}.output.log`
	)
	.option(
		'-i, --input <string>',
		'CURRENTLY BROKEN. DO NOT USE. Takes an input file and uses this as the prompt. The input MUST be in the .jsonl format.'
	)
	.option(
		'-m, --model <string>',
		"A string value representing a specified model name hosted on OpenAI's servers.",
		'text-davinci-003'
	)
	.option(
		'-p, --prompt <string>',
		'Passes a string value directly into the model as a prompt and uses the OpenAI completion endpoint.'
	)
	.option(
		'-t, --temp <float>',
		'Modified generation temperature. Temperature approaching 1 equates to more randomness in output. Value from 0 to 1.',
		parseFloat(0.7)
	)
	.option(
		'-v, --verbose',
		'Enables extraneous debugging information for most functions and services that support this flag.',
		false
	)
	.option(
		'-mt, --max_tokens <integer>',
		'Changes number of max_tokens output by the current model. This directly correlates with API usage and pricing.',
		64
	)
	.option(
		'-ft, --fine_tune <string>',
		"Train and upload a fine-tune dataset into OpenAI's servers to create a new model."
	)
	.option(
		'-co, --count <integer>',
		'The number of images to generate using the DALL-E endpoint. Only works for this API.',
		1
	)
	.option(
		'-s, --size <string>',
		'The image size of the attempted generated image. Only approved resolutions will be accepted. (256x256, 512x512, 1024x1024)',
		'256x256'
	)
	.option(
		'-st, --stream',
		'If enabled, will stream data directly from the OpenAI endpoint to your browser. Warning: this may not work as intended, as this is a workaround.',
		false
	)
	.showSuggestionAfterError(true)
	.showHelpAfterError(
		'\n(type --help for additional information on commands)\n'
	)
	.configureHelp({
		sortSubcommands: true,
		sortOptions: true,
	})
	.addHelpText(
		'after',
		'\nUsage: \nyarn dev -bv -t 1 -mt 256 -p "What are 5 main security concepts when designing an API?"'
	)
	.addHelpText(
		'after',
		'\nPlease view the CHANGELOG.md file for more information on what has changed from the previous version.'
	)
	.addHelpText(
		'after',
		"\n💡 Remember to follow OpenAI's usage guidelines.\nhttps://beta.openai.com/docs/usage-policies\n"
	)
	.parse(process.argv);

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.json(),
	transports: [
		//
		// - Write all logs with importance level of `error` or less to `error.log`
		// - Write all logs with importance level of `info` or less to `combined.log`
		//
		new winston.transports.File({
			filename: 'logs/system/error.log',
			level: 'error',
		}),
		new winston.transports.File({ filename: 'logs/system/combined.log' }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

exports.winstonAddFileTransport = (filename, verboseContent) => {
	logger.add(
		new winston.transports.File({
			filename: `${filename}`,
			format: winston.format.printf(
				(info) =>
					`${
						verboseContent ? verboseContent + '\n' : ''
					}${info.message.trim()}`
			),
		})
	);
};
exports.logger = logger;
exports.options = commander.opts();
