## Version 3

-   Added `-st, --stream` flag to enable response streaming from the API endpoint, similar to how the playground functions.
-   Added `-c, --config` flag to import model settings from an external JSON file.
-   Added `-e, --echo` flag to give the option to echo the prompt alongside the completed output.
-   Updated `--temperature` to `--temp` to make it easier to type.
-   Updated `-n, --number` to `-co, --count` for DALL-E endpoints to make more sense.
-   Updated the `-v, --verbose` flag to now include verbose information in generated logs while beautify is enabled, and only output completed time and info tags when using this flag.
-   Changed default `temp` value from 1 to 0.7, reflecting OpenAI's default temperature.
-   Updated README.md with more general and command information, fixed typos and grammar, updated URLs.

### Version 2

-   Implemented DALL-E API.
-   Setting up the foundations for using external input as prompts. (Not yet completely set up yet!)
-   General README fixes, updates to the command table.

### Version 1

-   Initial setup! Beta Release!
-   Basic OpenAI API endpoint capabilities.
-   Setting groundwork for more complex API / CLI features.
