const fs = require('fs');
const { options, logger, winstonAddFileTransport } = require('../lib/utils');
require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const winston = require('winston/lib/winston/config');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// TODO: Implement the -i input option to import external prompts from file.

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
					fs.createReadStream(payload),
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
					'Submitted! Please give it time process on the OpenAI servers.'
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
		version: 0.2,
		beautify_enabled: options.beautify,
		temperature: parseInt(options.temperature),
		model: options.prompt
			? `${options.model}`
			: `No model selected. Running in DALL-E mode.`,
		max_tokens: options.prompt
			? parseInt(options.max_tokens)
			: `No max tokens. Running in DALL-E mode.`,
		dalle: options.dalle,
		number: options.dalle
			? options.number
			: `No number of images. Running in GPT-3 mode.`,
		size: options.dalle
			? options.size
			: `No specified size. Running in GPT-3 mode.`,
	};

	options.verbose ? logger.info(JSON.stringify(vObj)) : null;

	// Please refer to ./lib/utils for more information on arguments.
	if (options.output) {
		winstonAddFileTransport(options.output);
	}

	if (options.prompt) {
		const response = await openai.createCompletion({
			model: `${options.model}`,
			prompt: `${options.prompt}`,
			temperature: parseInt(options.temperature),
			max_tokens: options.max_tokens ? parseInt(options.max_tokens) : 64,
		});
		options.beautify
			? logger.info(beautify(response.data.choices[0].text))
			: logger.info(JSON.stringify(response.data.choices));
	}

	if (options.dalle) {
		const response = await openai.createImage({
			prompt: `${options.dalle}`,
			n: parseInt(options.number),
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
	if (options.fine_tune) {
		trainFineTuneModel(options.fine_tune);
	}
};

main();
