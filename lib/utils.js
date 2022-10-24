const commander = require('commander');

commander
	.version('1.0.0', '-v, --version')
	.usage('[OPTIONS]...')
	.option(
		'-b, --beautify',
		"Formats the HTTP response to look beautiful from OpenAI's API. Note: 'p' was already taken by 'prompt', let alone 'prettier'."
	)
	.option('-p, --prompt <string>', 'Passes a string value directly into model as a prompt.')
	.option('-mt, --max_tokens <integer>', 'Changes number of max-tokens allowed output by GPT-3.')
	.option('-ft, --fine_tune <string>', "Upload a fine-tune model file into OpenAI's servers.")
	.parse(process.argv);

exports.options = commander.opts();
