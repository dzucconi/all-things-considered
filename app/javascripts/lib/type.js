import rand from './rand';

export default (el, message) => {
  const letters = message.split('')
    .map(letter => `<span class='letter'>${letter}</span>`)
    .concat([' ', ' ', ' ']);

  el.innerHTML = letters.shift();

  return letters.reduce((promise, letter) =>
    promise.then(() => new Promise(resolve => {
      setTimeout(() =>
        resolve(el.innerHTML += letter)
      , rand(15, 250));
    })), Promise.resolve(true));
};
