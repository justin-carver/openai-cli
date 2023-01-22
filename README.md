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

| Flag                        | Description                                                                                                                                                 | Default Value                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| -b, --beautify              | Formats the output from the request to look beautiful. Note: 'p' was already taken by 'prompt', let alone 'prettier'.                                       | false                           |
| -c, --config [string]       | Import specified config file to use with query to endpoint. Must be in JSON format. Config values match the flags listed in this table.                     |                                 |
| -co, --count [integer]      | Specifies the number of images that should be produced using DALL-E.                                                                                        | 1                               |
| -d, --dalle [string]        | Enables generation of DALL-E images using the command-line with a specified prompt.                                                                         |                                 |
| -ft, --fine_tune [string]   | Train and upload a fine-tune dataset into OpenAI's servers to create a new model.                                                                           |                                 |
| -h, --help                  | Display help for all commands listed.                                                                                                                       |                                 |
| -i, --input [string]        | CURRENTLY BROKEN. DO NOT USE. Import external prompt or multiple prompts from local JSON file.                                                              |                                 |
| -s, --size [string]         | The preferred resolution of images produced by DALL-E. (256x256, 512x512, 1024x1024)                                                                        | 256x256                         |
| -m, --model [string]        | A string value representing the model name hosted on OpenAI's servers.                                                                                      | 'text-davinci-003'              |
| -mt, --max_tokens [integer] | Changes number of max tokens output by the current model. This directly correlates with API usage and pricing.                                              | 64                              |
| -o, --output [string]       | Redirects the generated log file to a new output location. Note that if the file already exists, it will be overwritten without warning.                    | 'logs/output/[date].output.log' |
| -p, --prompt [string]       | Passes a string value directly into model as a prompt.                                                                                                      |                                 |
| -s, --size [string]         | The image size of the attempted generated image. Only approved resolutions will be accepted. Must use a DALL-E model. (256x256, 512x512, 1024x1024)         | "256x256"                       |
| -st, --stream               | If enabled, will stream data directly from the OpenAI endpoint to your terminal. Warning: this may sometimes not work as intended, as this is a workaround. | false                           |
| -t, --temp [float]          | Modified generation temperature. Temperature approaching 1 equates to more randomness in output. Value from 0 to 1.                                         | 0.7                             |
| -v, --verbose               | Enables extraneous debugging information for most functions and services that support this flag.                                                            | false                           |

## Command-Line Example

```txt
$ node ./src/index.js -bv -t 1 -mt 256 -p "What are 5 main security concepts when designing an API?"

info: {"version":0.2,"beautify_enabled":true,"temperature":1,"model":"text-davinci-003","max_tokens":256}
info:
The five main security concepts when designing an API include:

1. Authentication: API consumers must be authenticated in order to access the API.

2. Authorization: API consumers must be authorized to access the API.

3. Encryption: API communications should be encrypted in order to ensure privacy.

4. Rate limiting: API consumers should be rate-limited in order to prevent malicious or excessive use.

5. Input validation: API consumers should be required to provide valid input in order to prevent security risks.

Done in 4.61s.
```

### Output

By default, all generated output will be directed into a folder labeled `logs/output/[date].output.log`. This is to save working ideas or review generated content.
