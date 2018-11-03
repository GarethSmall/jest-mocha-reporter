//@flow
import path from 'path';
import { helpers } from './helpers';
import fs from 'fs';
import type { AggregatedResultWithoutCoverage, AssertionResult, TestResult } from './jest-types/TestResult';


/* eslint-disable no-unused-vars */
/**
 * A function that is used to process our jest reports.
 * @param report
 * @param contexts
 * @returns {AggregatedResultWithoutCoverage}
 */
function reporter(report : AggregatedResultWithoutCoverage, contexts? : Object) : AggregatedResultWithoutCoverage {
  /* eslint-enable no-unused-vars */
  const output = {
    stats: {},
    failures: [],
    passes: [],
    skipped: [],
  };

  /**
   * We will need to update this support defining a configuration.
   */
  const filename = process.env.JEST_MOCHA_FILE || 'test-report.json';
  const suiteNameTemplate =
    process.env.JEST_MOCHA_SUITE_NAME || '{firstAncestorTitle|filePath}';
  const nameSeparator = process.env.JEST_MOCHA_NAME_SEPARATOR || ' – ';

  output.stats.tests = report.numTotalTests;
  output.stats.passes = report.numPassedTests;
  output.stats.failures = report.numFailedTests;
  output.stats.duration = Date.now() - report.startTime;
  output.stats.start = new Date(report.startTime);
  output.stats.end = new Date();

  const existingTestTitles = Object.create(null);

  report.testResults.forEach(function(suiteResult : TestResult) {
    const testFileName = path.basename(suiteResult.testFilePath);

    if (suiteResult.failureMessage && suiteResult.testResults.length === 0) {
      const suiteName = helpers.replaceCharsNotSupportedByBamboo(
        helpers.replaceVariables(suiteNameTemplate, {
          firstAncestorTitle: suiteResult.displayName,
          filePath: suiteResult.testFilePath,
          fileName: testFileName,
          fileNameWithoutExtension: path.parse(testFileName).name,
        }),
      );
      output.failures.push({
        title: suiteName,
        fullTitle: suiteName,
        duration: suiteResult.perfStats.end - suiteResult.perfStats.start,
        errorCount: 1,
        error: suiteResult.failureMessage,
      });
    }

    suiteResult.testResults.forEach(function(testResult : AssertionResult) {
      const suiteName = helpers.replaceCharsNotSupportedByBamboo(
        helpers.replaceVariables(suiteNameTemplate, {
          firstAncestorTitle: testResult.ancestorTitles[0],
          filePath: suiteResult.testFilePath,
          fileName: testFileName,
          fileNameWithoutExtension: path.parse(testFileName).name,
        }),
      );
      let testTitle = helpers.replaceCharsNotSupportedByBamboo(
        testResult.ancestorTitles
          .concat([testResult.title])
          .join(nameSeparator),
      );

      if (testTitle in existingTestTitles) {
        let newTestTitle;
        let counter = 1;
        do {
          counter++;
          newTestTitle = testTitle + ' (' + counter + ')';
        } while (newTestTitle in existingTestTitles);
        testTitle = newTestTitle;
      }

      existingTestTitles[testTitle] = true;

      const result = {
        title: testTitle,
        fullTitle: suiteName,
        duration: suiteResult.perfStats.end - suiteResult.perfStats.start,
        errorCount: testResult.failureMessages.length,
        error: testResult.failureMessages.length
          ? helpers.formatErrorMessages(testResult.failureMessages)
          : undefined,
      };

      switch (testResult.status) {
        case 'passed':
          output.passes.push(result);
          break;
        case 'failed':
          output.failures.push(result);
          break;
        case 'pending':
          output.skipped.push(result);
          break;
        default:
          throw new Error(
            'Unexpected test result status: ' + testResult.status,
          );
      }
    });
  });
  fs.writeFileSync(filename, JSON.stringify(output, null, 2), 'utf8');
  return report;
}

export { reporter };
