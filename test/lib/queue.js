import Queue from '../../app/javascripts/lib/queue';

describe('Queue', () => {
  it('works', () => {
    const queue = new Queue;

    queue.enqueue([
      'foo',
      'bar',
      'baz'
    ]);

    console.log(queue.dequeue());
  });
});
