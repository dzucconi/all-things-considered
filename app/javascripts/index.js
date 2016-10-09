import fetch from 'axios';
import Queue from './lib/queue';
import * as is from './lib/is';
import type from './lib/type';

const CONFIG  = {
  size: 5,
  speed: 1000,
};

const DOM = {
  app: document.getElementById('app'),
  chat: document.getElementById('chat'),
  input: document.getElementById('input'),
  messages: document.getElementsByClassName('message'),
};

window.DOM = DOM;

const get = color => () =>
  fetch(`http://dictionary.${color}/verse?n=${CONFIG.size}`);

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
  them: x => `${x}.`,
  me: x => `${x}?`,
};

const trim = () =>
  Array.prototype.filter.call(DOM.messages, is.offscreen)
    .map(node => DOM.chat.removeChild(node));

const send = () =>
  DOM.input.innerHTML = `
    <div class='placeholder'>Message</div>
  `;

const append = () => {
  take(STATE.queues[STATE.queue])
    .then(([message]) => {
      message = cast[STATE.queue](message);

      const html = render[STATE.queue](message);

      return STATE.queue === 'me'
        ? type(DOM.input, message).then(() => html)
        : Promise.resolve(html);
    })
    .then(html => {
      if (STATE.queue === 'me') send();

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
      setTimeout(append, CONFIG.speed));
};

export default () => {
  append();
};
