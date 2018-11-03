import fs from 'fs';
import sinon from 'sinon';
import { reporter } from './reporter';

function processResults(filename) {
  return reporter(
    JSON.parse(fs.readFileSync(__dirname + '/test-files/' + filename, 'utf8')),
    {},
  );
}

describe('reporter', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(new Date('2016-08-18T12:00:55.242Z'));
  });

  afterEach(function() {
    clock.restore();
    fs.unlinkSync('./test-report.json');
  });

  it('should create the expected result', function() {
    processResults('jest-output.json');
    var actualResult = JSON.parse(
      fs.readFileSync('./test-report.json', 'utf8'),
    );
    var expectedResult = JSON.parse(
      fs.readFileSync(__dirname + '/test-files/expected-result.json', 'utf8'),
    );

    expect(actualResult).toEqual(expectedResult);
  });

  it('should use suite name template', function() {
    try {
      process.env.JEST_BAMBOO_SUITE_NAME = '{fileNameWithoutExtension}';
      processResults('jest-output.json');
      var actualResult = JSON.parse(
        fs.readFileSync('./test-report.json', 'utf8'),
      );
      var expectedResult = JSON.parse(
        fs.readFileSync(
          __dirname + '/test-files/expected-result-with-filename.json',
          'utf8',
        ),
      );

      expect(actualResult).toEqual(expectedResult);
    } finally {
      delete process.env.JEST_BAMBOO_SUITE_NAME;
    }
  });

  it('should report test case failures', function() {
    processResults('case-failure.json');
    var actualResult = JSON.parse(
      fs.readFileSync('./test-report.json', 'utf8'),
    );
    expect(actualResult.failures).toHaveLength(2);
  });

  it('should report test suite failures', function() {
    processResults('suite-failure.json');
    var actualResult = JSON.parse(
      fs.readFileSync('./test-report.json', 'utf8'),
    );
    expect(actualResult.failures).toHaveLength(1);
  });
});
