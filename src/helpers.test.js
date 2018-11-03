import { helpers } from './helpers';

describe('helpers', function() {
  it('should replace variable', function() {
    expect(helpers.replaceVariables('test {a} template', { a: 1 })).toEqual(
      'test 1 template',
    );
  });

  it('should replace multiple variables', function() {
    expect(
      helpers.replaceVariables('{a} test {b} template {c}', {
        a: 1,
        b: 2,
        c: 3,
      }),
    ).toEqual('1 test 2 template 3');
  });

  it('should fallback when variable is empty', function() {
    expect(
      helpers.replaceVariables('test {a|b} template', { a: '', b: 2 }),
    ).toEqual('test 2 template');
    expect(
      helpers.replaceVariables('test {a|b} template {c|d}', {
        a: '',
        b: 1,
        c: null,
        d: 2,
      }),
    ).toEqual('test 1 template 2');
  });

  it('should fallback multiple variables', function() {
    expect(
      helpers.replaceVariables('test {a|b|c} template', {
        a: '',
        b: null,
        c: 3,
      }),
    ).toEqual('test 3 template');
  });

  it('should treat unknown variable as text', function() {
    expect(
      helpers.replaceVariables('test {undefinedVariable} template', {}),
    ).toEqual('test undefinedVariable template');
  });
});
