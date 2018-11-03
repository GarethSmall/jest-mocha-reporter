// @flow
import type { AggregatedResultWithoutCoverage } from './jest-types/TestResult';
import { reporter } from './reporter';
import type { InitialOptions } from './jest-types/Config';

/**
 * The function used by jest to act as either a reporter or testResultsProcessor.
 * In this function we handle direction to either the supported reporter
 * or we direct to testResultsProcessor.
 * @param globalConfig
 * @returns {AggregatedResultWithoutCoverage}
 * @constructor
 */
function JestMochaReporter(
  globalConfig : InitialOptions | AggregatedResultWithoutCoverage,
) {
  /**
   * Backwards compatibility for testResultsProcessor
   */
  if (globalConfig && globalConfig.hasOwnProperty('testResults')) {
    /**
     * If we don't type cast, flow complains :|
     */
    const report : AggregatedResultWithoutCoverage = (globalConfig : any);

    return reporter(report);
  }

  this.onRunComplete = (
    contexts : Object,
    report : AggregatedResultWithoutCoverage,
  ) => {
    return reporter(report, contexts);
  };
}

export default JestMochaReporter;
