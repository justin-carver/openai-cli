const fs = require('fs');
const { options } = require('./lib/utils');
require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 *
 * @param {string} payload
 * @param {boolean} verbose
 */
const trainFineTuneModel = async (payload = '', verbose = false, suffix = 'model-suffix') => {
	// Fine-Tuning Submission & Training
	// ? Upload file to OpenAI servers.
	if (payload !== null || payload !== '') {
		let uploadFile;

		// Attempt to upload the model.
		try {
			uploadFile = await openai.createFile(fs.createReadStream(payload), 'fine-tune');
			// Analyze the fine-tune model.
			try {
				const fineTuneResponse = await openai.createFineTune({
					training_file: uploadFile.data.id,
					model: 'davinci',
					suffix: `${suffix}`,
				});
				console.log('Submitted! Please give it time process on the OpenAI servers.');
				verbose ? console.log(fineTuneResponse) : null;
			} catch (e) {
				throw new Error(`Error submitting your fine-tune model. Please try again.\n${e}`);
			}
			return;
		} catch (e) {
			throw new Error(`Unable to load file from ${payload}.\n${e}`);
		}
	}
};

const prettier = () => {};

const main = async () => {
	// Please refer to ./lib/commander for more information on arguments.
	if (options.prompt) {
		const response = await openai.createCompletion({
			model: 'text-davinci-002',
			prompt: `${options.prompt}`,
			max_tokens: options.max_tokens ? parseInt(options.max_tokens) : 64,
		});
		options.prettier ? console.log(prettier()) : console.log(response.data.choices);
	}

	// ? Remember! Fine-tuning can be pricey!
	if (options.fine_tune) {
		trainFineTuneModel(options.fine_tune);
	}
};

main();
