const fs = require('fs');
const https = require('https');
const { options, logger, winstonAddFileTransport } = require('../lib/utils');
require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const winston = require('winston/lib/winston/config');
const { verbose } = require('winston');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const openAICompletionQuery = {
	model: `${options.model}`,
	prompt: `${options.prompt}`,
	temperature: parseFloat(options.temp),
	max_tokens: parseInt(options.max_tokens),
	echo: options.echo,
	stream: options.stream,
};

/**
 * Both submits and trains the fine-tune dataset for the specified model.
 * Note: This does not verify if the training set is valid. Please refer to OpenAI's documentation
 *       on validating datasets.
 * @param {string} payload - The location of the pre-verified training set.
 * @param {string} model - The required model that the dataset will fine-tune against.
 * @param {string} suffix - String value applied to the model name for faster locating.
 * @param {boolean} verbose - Outputs the response object from the completed fine-tune job.
 */
const trainFineTuneModel = async (
	payload,
	model = 'davinci',
	suffix = 'openai-cli',
	verbose = options.verbose
) => {
	// ? Upload file to OpenAI servers.
	if (payload !== null || payload !== '') {
		let uploadFile;

		// Attempt to upload the training set.
		try {
			if (payload.includes('.jsonl')) {
				console.log('Inside!');
				uploadFile = await openai.createFile(
					fs.createReadStream(payload, { encoding: 'utf-8' }),
					'fine-tune'
				);
			} else {
				logger.error(
					'Training dataset is not of type .jsonl or provide the correct extension.'
				);
				return;
			}
			// Train the fine-tune model against the data.
			try {
				const fineTuneResponse = await openai.createFineTune({
					training_file: uploadFile.data.id,
					model: `${model}`,
					suffix: `${suffix}`,
				});
				logger.info(
					'Submitted! Please give it time to process on the OpenAI servers...'
				);
				verbose ? console.log(fineTuneResponse) : null;
			} catch (e) {
				logger.error(
					`Error submitting your fine-tune model. Please try again.\n${e}`
				);
			}
			return;
		} catch (e) {
			logger.error(`Unable to load file from ${payload}.\n${e}`);
		}
	}
};

// ? Separating logic to expand on this later. Keep it simple for now.
const beautify = (string) => `\n\n${string.trim()}\n`;

const main = async () => {
	const vObj = {
		// verbose obj
		version: 0.3,
		beautify: options.beautify,
		temp: parseFloat(options.temp),
		prompt: options.prompt,
		stream: options.stream,
		echo: options.echo,
		model: options.prompt
			? `${options.model}`
			: `No model selected. Running in Dall-E mode.`,
		max_tokens: options.prompt
			? options.max_tokens
			: `No max tokens. Running in Dall-E mode.`,
		dalle: options.dalle,
		count: options.dalle
			? options.count
			: `No number of images. Running in GPT mode.`,
		size: options.dalle
			? options.size
			: `No specified size. Running in GPT mode.`,
	};

	options.verbose ? logger.info(JSON.stringify(vObj)) : null;

	// ? Config file overwrites command-line arguments!
	// ? Multiple prompt query must be used with the -i flag.
	// TODO: Organize later.
	if (options.config) {
		const config = JSON.parse(
			fs.readFileSync(options.config, { encoding: 'utf-8' })
		);
		config.temp ? (options.temp = config.temp) : options.temp;
		config.max_tokens
			? (options.max_tokens = config.max_tokens)
			: options.max_tokens;
		config.beautify
			? (options.beautify = config.beautify)
			: options.beautify;
		config.model ? (options.model = config.model) : options.model;
		config.dalle ? (options.dalle = config.dalle) : options.dalle;
		config.size ? (options.size = config.size) : options.size;
		config.model ? (options.model = config.model) : options.model;
		config.count ? (options.count = config.count) : options.count;
		config.output ? (options.output = config.output) : options.output;
		config.prompt ? (options.prompt = config.prompt) : options.prompt;
		config.stream ? (options.stream = config.stream) : options.stream;
		config.verbose ? (options.verbose = config.verbose) : options.verbose;
		config.input ? (options.input = config.input) : options.input;
	}

	// Please refer to ./lib/utils for more information on arguments.
	if (options.output) {
		winstonAddFileTransport(
			options.output,
			verbose ? JSON.stringify(vObj) : ''
		);
	}

	if (options.input) {
		const input = fs.readFileSync(options.input, { encoding: 'utf-8' });
		const jsonData = JSON.parse(input);

		for (let key in jsonData) {
			const response = await openai.createCompletion(
				{
					...openAICompletionQuery,
					prompt: jsonData[key],
				},
				{ responseType: 'text' }
			);
			// console.log(response);
			options.beautify
				? logger.info(beautify(response.data.choices[0].text))
				: logger.info(JSON.stringify(response.data.choices));
		}
	}

	if (options.stream && options.prompt) {
		// https://2ality.com/2018/04/async-iter-nodejs.html#generator-%231%3A-from-chunks-to-lines
		async function* chunksToLines(chunksAsync) {
			let previous = '';
			for await (const chunk of chunksAsync) {
				const bufferChunk = Buffer.isBuffer(chunk)
					? chunk
					: Buffer.from(chunk);
				previous += bufferChunk;
				let eolIndex;
				while ((eolIndex = previous.indexOf('\n')) >= 0) {
					// line includes the EOL
					const line = previous.slice(0, eolIndex + 1).trimEnd();
					if (line === 'data: [DONE]') break;
					if (line.startsWith('data: ')) yield line;
					previous = previous.slice(eolIndex + 1);
				}
			}
		}

		async function* linesToMessages(linesAsync) {
			for await (const line of linesAsync) {
				const message = line.substring('data :'.length);

				yield message;
			}
		}

		async function* streamCompletion(data) {
			yield* linesToMessages(chunksToLines(data));
		}

		let output = '';

		try {
			const completion = await openai.createCompletion(
				openAICompletionQuery,
				{ responseType: 'stream' }
			);

			for await (const message of streamCompletion(completion.data)) {
				try {
					const parsed = JSON.parse(message);
					const { text } = parsed.choices[0];

					process.stdout.write(text);
					output += text;
				} catch (error) {
					logger.error(
						'Could not JSON parse stream message',
						message,
						error
					);
				}
			}
			process.stdout.write('\n');

			// Manually append to file, creating a new logger would complicate things.
			fs.appendFileSync(
				`logs/output/${new Date()
					.toISOString()
					.replace(/T.*/, '')
					.split('-')
					.join('-')}.output.log`,
				`${JSON.stringify(vObj)}\n${output}`,
				(err) => {
					if (err) throw err;
				}
			);
		} catch (error) {
			if (error.response?.status) {
				logger.error(error.response.status, error.message);

				for await (const data of error.response.data) {
					const message = data.toString();

					try {
						const parsed = JSON.parse(message);

						logger.error(
							'An error occurred during OpenAI request: ',
							parsed
						);
					} catch (error) {
						logger.error(
							'An error occurred during OpenAI request: ',
							message
						);
					}
				}
			} else {
				logger.error('An error occurred during OpenAI request', error);
			}
		}
	} else {
		const response = await openai.createCompletion(openAICompletionQuery);
		options.beautify
			? logger.info(beautify(response.data.choices[0].text))
			: logger.info(JSON.stringify(response.data.choices));
	}

	if (options.dalle) {
		const response = await openai.createImage({
			prompt: `${options.dalle}`,
			n: parseInt(options.count),
			size: options.size,
		});
		if (response.data.data.length > 1) {
			response.data.data.forEach((image, i) => {
				logger.info(
					beautify(`Link to image (#${i + 1}):\t${image.url}`)
				);
			});
		} else {
			logger.info(
				beautify(`Link to image:\t${response.data.data[0].url}`)
			);
		}
	}

	// ? Remember! Fine-tuning can be pricey!
	// ? https://openai.com/api/pricing/
	if (options.fine_tune) {
		trainFineTuneModel(options.fine_tune);
	}
};

main();
