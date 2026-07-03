const test = require('node:test');
const assert = require('node:assert/strict');

const { getFileExtension, validateMediaType } = require('../utils/media');

test('media helper identifies file extension and type', () => {
  assert.equal(getFileExtension('photo.png'), 'png');
  assert.equal(validateMediaType('image/png'), true);
  assert.equal(validateMediaType('application/pdf'), false);
});
