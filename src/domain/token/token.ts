import t from 'tcomb';

const Token = t.struct({
  expiryDate: t.maybe(t.Any),
  id: t.maybe(t.Number),
  token: t.maybe(t.Any),
});

export default Token;
