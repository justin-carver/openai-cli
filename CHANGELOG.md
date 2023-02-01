## Verison 4

-   Added `-fp, --freq_pen` flag to allow modifications to the frequency penalty.
-   Added `-pp, --pres_pen` flag to allow modifications to the presence penalty.
-   Added `-ij, --inject` flag to allow appending text to the end of a prompt string. Great for using external/config prompts.
-   Added `-n, --number` flag to edit the amount of completions returned by the endpoint.
-   Added `-tp, --top_p` flag to give an alternative to sampling output.
-   Added `-su, --suffix` flag to continue migrating the API. Suffixes are not the same as injections, please refer to the documentation in the README.md.
-   Added `--stop` flag to allow up to 4 stop sequences.
-   Tweaking `--stream` flag performance and appearance.
-   Updated verbose object (vObj) to use shorter descriptions.
-   Fixed issued with config files not actually assuming new parameters when using it.
-   Streamlined core functions.

### Version 3

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
