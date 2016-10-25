import * as errors from './errors';

export default x =>
  x.split('').map(x => {
    if (errors.probability(0.05)) x = errors.transposition(x);
    if (errors.probability(0.1)) x = errors.caps(x);
    return x;
  }).join('');
