# jest-mocha-reporter

A reporter for jest which produces a report compatible with Atlassian Bamboo Mocha Test Parser.

_This is compatible with both reporter and testResultsProcessor_

See [Reporters](https://jestjs.io/docs/en/configuration.html#reporters-array-modulename-modulename-options)

See [testResultsProcessor](https://jestjs.io/docs/en/configuration.html#testresultsprocessor-string)

[![Build Status](https://travis-ci.org/GarethSmall/jest-mocha-reporter.svg?branch=master)](https://travis-ci.org/GarethSmall/jest-mocha-reporter)


## Forked From
- Forked from [jest-bamboo-reporter](https://github.com/CHECK24/jest-bamboo-reporter/commits/master)
    - Forked from [jest-bamboo-formatter](https://github.com/adalbertoteixeira/jest-bamboo-formatter)

## Installation

~~~sh
npm install --save-dev jest-mocha-reporter
~~~

## Usage

In the jest config file add the path to the module.

If you are using [testResultsProcessor](https://jestjs.io/docs/en/configuration.html#testresultsprocessor-string):

~~~json
{
    "testResultsProcessor": "jest-mocha-reporter"
}
~~~

If you are using [Reporters](https://jestjs.io/docs/en/configuration.html#reporters-array-modulename-modulename-options):

~~~json
{
    "reporter": "jest-mocha-reporter"
}
~~~

See [Configuring Jest](https://jestjs.io/docs/en/configuration.html).

## Configuration

The name of test suite and separator can be customized by setting the environment variables

~~~sh
JEST_MOCHA_SUITE_NAME="{fileNameWithoutExtension}" JEST_MOCHA_NAME_SEPARATOR=" >> " jest
~~~

`JEST_MOCHA_SUITE_NAME` supports following variables
- firstAncestorTitle: The name of the outermost "describe" group
- filePath: Full path of the test
- fileName: File name of the test
- fileNameWithoutExtension: File name of the test without extension

Also, variable supports fallback. For example: 
`{firstAncestorTitle|filename}` means use file name of the test if it doesn't have a group name.

## Output

By default, the reporter writes to `test-report.json`. The file name can be changed by setting the `JEST_REPORT_FILE` environment variable.

~~~sh
JEST_REPORT_FILE="./jest-report.json" jest
~~~

## License

[MIT](https://github.com/CHECK24/jest-bamboo-reporter/blob/master/LICENSE)
