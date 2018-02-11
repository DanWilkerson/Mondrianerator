const test = require('tape');
const faucet = require('faucet');
const GenerateSeed = require('./../src/GenerateSeed.js');

test('global test', function (t) {

  t.plan(1);

  t.equal(typeof Mondrian, 'function');

});
