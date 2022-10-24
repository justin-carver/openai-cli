# openai-cli

This is a simple, command-line wrapper for the OpenAI API to allow for a quicker, more flowing interaction with OpenAI's natural language models.

Not all of the API is currently working via the CLI, but I am the process of adding more commands as time goes on. Please reach out with an issue or pull request if you'd like a certain API function to be developed quicker.

Built on: [openai-node](https://github.com/openai/openai-node)

## Installation

1. Fork/Clone this repository.
2. Run `yarn install` within this repo.
3. Create a `.env` file, verify that it contains a valid `OPENAI_API_KEY` field using your private API key.
4. Begin utilizing the commands below.

## Flags

| Flag                        | Description                                                                                                                                                    | Default Value                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| -b, --beautify              | Formats the HTTP response from OpenAI's API to look beautiful. Note: 'p' was already taken by 'prompt', let alone 'prettier'.                                  | false                           |
| -ft, --fine_tune <string>   | Train and upload a fine-tune dataset into OpenAI's servers to create a new model.                                                                              | (left blank to throw error)     |
| -h, --help                  | display help for command                                                                                                                                       |                                 |
| -m, --model <string>        | A string value representing the model name hosted on OpenAI's servers.                                                                                         | 'text-davinci-002'              |
| -mt, --max_tokens <integer> | Changes number of max_tokens output by the current model. This directly correlates with API usage and pricing.                                                 | 64                              |
| -o, --output <string>       | Writes the detected irony-probabilities in JSON-40000 to output_path/model_name. Note that if the file already exists, it will be overwritten without warning. | 'logs/output/[date].output.log' |
| -p, --prompt <string>       | Passes a string value directly into model as a prompt.                                                                                                         | "What makes a good API?"        |
| -t, --temperature           | Modified generation temperature. Temperature approaching 1 equates to more randomness in output. Value from 0 to 1.                                            | 1                               |
| -v, --verbose               | Enables extraneous debugging information for most functions and services that support this flag.                                                               | false                           |

## Command-Line Example

```txt
$ node ./src/index.js -b -v -t 1 -mt 256 -p "What are 5 main security concepts when designing an API?"

info: {"version":0.2,"beautify_enabled":true,"temperature":1,"model":"text-davinci-002","max_tokens":256}
info:
The five main security concepts when designing an API include:

1. Authentication: API consumers must be authenticated in order to access the API.

2. Authorization: API consumers must be authorized to access the API.

3. Encryption: API communications should be encrypted in order to ensure privacy.

4. Rate limiting: API consumers should be rate-limited in order to prevent malicious or excessive use.

5. Input validation: API consumers should be required to provide valid input in order to prevent security risks.

Done in 4.61s.
```
