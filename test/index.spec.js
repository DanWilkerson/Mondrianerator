const test = require('tape');
const faucet = require('faucet');
const Mondrian = require('./../src/index.js');
console.log('running');
test('global test', function (t) {

  t.plan(1);

  t.equal(typeof Mondrian, 'function');

});
