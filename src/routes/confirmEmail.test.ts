import fetch from 'node-fetch';

it('sends invalid back if bad id sent', async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/kasdfkas23`);
  const text = await response.text();
  expect(text).toEqual('invalid');
});
