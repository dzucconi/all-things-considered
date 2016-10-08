import Queue from './lib/queue';
import fetch from 'axios';

const CONFIG  = {
  size: 5,
  speed: 2000,
};


const DOM = {
  app: document.getElementById('app'),
};

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
  return new Promise(resolve => resolve(queue.dequeue()));
};

const render = {
  them: x => `<div class='them'>${x}.</div>`,
  me: x => `<div class='me'>${x}?</div>`,
};

const append = () =>
  take(STATE.queues[STATE.queue])
    .then(([chat]) => render[STATE.queue](chat))
    .then(html => {
      DOM.app.innerHTML += html;
      window.scrollTo(0, document.body.scrollHeight);
      STATE.queue = STATE.queue === 'them' ? 'me' : 'them';
    });

export default () => {
  setInterval(append, CONFIG.speed);
};
