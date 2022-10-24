const fs = require('fs');
const { options, logger, winstonAddFileTransport } = require('../lib/utils');
require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const winston = require('winston/lib/winston/config');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
	suffix = 'openai-wrapper',
	verbose = options.verbose
) => {
	// ? Upload file to OpenAI servers.
	if (payload !== null || payload !== '') {
		let uploadFile;

		// Attempt to upload the training set.
		try {
			if (payload.contains('.jsonl')) {
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
const beautify = (string) => `\n${string.trim()}\n`;

const main = async () => {
	const vObj = {
		version: 0.2,
		beautify_enabled: options.beautify,
		temperature: parseInt(options.temperature),
		model: `${options.model}`,
		max_tokens: parseInt(options.max_tokens),
	};

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
		options.verbose ? logger.info(JSON.stringify(vObj)) : null;
		options.beautify
			? logger.info(beautify(response.data.choices[0].text))
			: logger.info(JSON.stringify(response.data.choices));
	} else {
		logger.error('No prompt was supplied. API force quit.');
	}

	// ? Remember! Fine-tuning can be pricey!
	if (options.fine_tune) {
		trainFineTuneModel(options.fine_tune);
	}
};

main();
