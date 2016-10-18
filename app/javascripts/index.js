import fetch from 'axios';
import Queue from './lib/queue';
import type from './lib/type';
import params from './lib/params';
import * as is from './lib/is';
import * as sounds from './lib/sounds';
import indicator from './lib/indicator';
import * as errors from './lib/errors';

const CONFIG  = {
  size: 25,
  speed: 1000,
  mute: true,
};

const PARAMS = params(CONFIG);

const DOM = {
  app: document.getElementById('app'),
  chat: document.getElementById('chat'),
  input: document.getElementById('input'),
  messages: document.getElementsByClassName('message'),
};

const get = color => () =>
  fetch(`http://dictionary.${color}/verse?n=${PARAMS.size}`);

const STATE = {
  queues: {
    them: new Queue({ fetch: get('red') }),
    me: new Queue({ fetch: get('pink') }),
  },
  queue: 'them',
};

const take = queue => {
  if (queue.isEmpty()) {
    return queue.fill().then(() => queue.dequeue());
  }
  return Promise.resolve(queue.dequeue());
};

const render = {
  them: x => `<div class='them message'>${x}</div>`,
  me: x => `<div class='me message'>${x}</div>`,
};

const cast = {
  them: x => `${humanize(x)}.`,
  me: x => `${humanize(x)}?`,
};

const humanize = x => x
  .split('')
  .map(x => {
    if (errors.probability(0.05)) x = errors.transposition(x);
    if (errors.probability(0.1)) x = errors.caps(x);
    return x;
  })
  .join('');

const trim = () =>
  Array.prototype.filter.call(DOM.messages, is.offscreen)
    .map(node => DOM.chat.removeChild(node));

const send = () =>
  DOM.input.innerHTML = `
    <div class='placeholder'>Message</div>
  `;

const indicate = () => {
  DOM.chat.appendChild(indicator);
  DOM.chat.scrollTop = DOM.chat.scrollHeight;

  return Promise.resolve(indicator);
};

const append = () => {
  take(STATE.queues[STATE.queue])
    .then(([message]) => {
      message = cast[STATE.queue](message);

      const html = render[STATE.queue](message);

      return STATE.queue === 'me'
        ? type(DOM.input, message).then(() => html)

        : indicate()
          .then(() => type(null, message, [5, 100]))
          .then(() => html);
    })
    .then(html => {
      if (STATE.queue === 'me') send();

      // Play sound effects
      if (!PARAMS.mute) sounds[STATE.queue === 'me' ? 'send' : 'receive'].play();

      // Remove indicator
      try {
        DOM.chat.removeChild(indicator);
      } catch(e) {
        // Ignore
      }

      // Append message
      DOM.chat.innerHTML += html;

      // Scroll to bottom of div
      DOM.chat.scrollTop = DOM.chat.scrollHeight;

      // Prune offscreen messages
      trim();

      // Apply conditional styling
      EQCSS.apply();

      // Toggle queues
      STATE.queue = STATE.queue === 'them' ? 'me' : 'them';
    })
    .then(() =>
      setTimeout(append, PARAMS.speed));
};

export default () => {
  append();
};
