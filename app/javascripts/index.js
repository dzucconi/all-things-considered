import fetch from 'axios';
import params from 'queryparams';
import times from './lib/times';
import Queue from './models/queue';
import Chat from './models/chat';

export default () => {
  const { size, amount, pause, mute } = params({
    amount: Math.floor(window.innerWidth / 320) || 1,
    size: 30,
    pause: 1000,
    mute: false,
  });

  const DOM = {
    container: document.getElementById('container'),
  };

  const them = new Queue({
    fetch: () => fetch(`http://dictionary.red/verse?n=${size}`),
  });

  const me = new Queue({
    fetch: () => fetch(`http://dictionary.pink/verse?n=${size}`),
  });

  them.fill()
    .then(() => me.fill())
    .then(() => {
      const chats = times(amount)
        .map(() =>
          new Chat({
            me,
            them,
            pause,
            mute
          })
        );

      DOM.container.innerHTML = chats.map(chat => chat.render().el).join('');

      chats.map(chat => chat.bind().run());
    });
};
