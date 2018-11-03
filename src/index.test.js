import fs from 'fs';
import sinon from 'sinon';
import JestMochaReporter from './index';

/**
 * Testing with jest reporter
 * @param filename
 */
function jestReporter(filename) {
  const reporter = new JestMochaReporter();
  return reporter.onRunComplete(
    {},
    JSON.parse(fs.readFileSync(__dirname + '/test-files/' + filename, 'utf8')),
  );
}

/**
 * Testing backwards compatibility with jest testResultsProcessor.
 * @param filename
 * @returns {*}
 */
function jestTestResultsProcessor(filename) {
  return JestMochaReporter(
    JSON.parse(fs.readFileSync(__dirname + '/test-files/' + filename, 'utf8')),
  );
}

describe('jest-mocha-reporter : jestTestResultsProcessor', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(new Date('2016-08-18T12:00:55.242Z'));
  });

  afterEach(function() {
    clock.restore();
    fs.unlinkSync('./test-report.json');
  });

  it('should create the expected result', function() {
    jestTestResultsProcessor('jest-output.json');
    var actualResult = JSON.parse(
      fs.readFileSync('./test-report.json', 'utf8'),
    );
    var expectedResult = JSON.parse(
      fs.readFileSync(__dirname + '/test-files/expected-result.json', 'utf8'),
    );

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('jest-mocha-reporter : jestReporter', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(new Date('2016-08-18T12:00:55.242Z'));
  });

  afterEach(function() {
    clock.restore();
    fs.unlinkSync('./test-report.json');
  });

  it('should create the expected result', function() {
    jestReporter('jest-output.json');
    var actualResult = JSON.parse(
      fs.readFileSync('./test-report.json', 'utf8'),
    );
    var expectedResult = JSON.parse(
      fs.readFileSync(__dirname + '/test-files/expected-result.json', 'utf8'),
    );

    expect(actualResult).toEqual(expectedResult);
  });
});
