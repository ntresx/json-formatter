import test from 'node:test';
import assert from 'node:assert/strict';
import { formatJson, minifyJson, parseJson } from '../../resources/js/json-utility.js';

test('valid JSON parses successfully', () => {
    const result = parseJson('{"name":"John","age":20,"active":true}');

    assert.equal(result.valid, true);
    assert.deepEqual(result.value, { name: 'John', age: 20, active: true });
});

test('invalid JSON returns a useful error', () => {
    const result = parseJson('{"name":"John",}');

    assert.equal(result.valid, false);
    assert.ok(result.error?.message);
});

test('nested objects and arrays are supported', () => {
    const input = '{"user":{"name":"Ada","roles":["admin","editor"]}}';
    const result = parseJson(input);

    assert.equal(result.valid, true);
    assert.deepEqual(result.value.user.roles, ['admin', 'editor']);
});

test('formatJson prettifies JSON with two spaces', () => {
    const input = '{"name":"John","active":true}';
    const output = formatJson(input, 2);

    assert.equal(output, '{\n  "name": "John",\n  "active": true\n}');
});

test('formatJson supports four spaces and tabs', () => {
    const input = '{"name":"John"}';

    assert.equal(formatJson(input, 4), '{\n    "name": "John"\n}');
    assert.equal(formatJson(input, '\t'), '{\n\t"name": "John"\n}');
});

test('minifyJson removes unnecessary whitespace', () => {
    const input = '{\n  "name": "John",\n  "active": true\n}';

    assert.equal(minifyJson(input), '{"name":"John","active":true}');
});

test('empty input is invalid', () => {
    const result = parseJson('');

    assert.equal(result.valid, false);
});

test('malformed input is invalid and never throws from parseJson', () => {
    assert.doesNotThrow(() => parseJson('{"name":'));
    assert.equal(parseJson('{"name":').valid, false);
});
