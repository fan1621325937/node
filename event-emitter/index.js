/**
 * @fileoverview Node.js EventEmitter 示例
 * @description 演示 EventEmitter 的基本用法，包括事件的触发、监听和移除。
 */

const EventEmitter = require('events');

/**
 * 自定义事件触发器类，继承自 EventEmitter。
 */
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// 注册事件监听器
/**
 * 监听 'event' 事件
 * 当 'event' 事件被触发时，此回调函数将被执行。
 * @param {string} msg - 事件触发时传递的消息。
 */
myEmitter.on('event', (msg) => {
  console.log(`收到事件：${msg}`);
});

/**
 * 监听 'anotherEvent' 事件，只监听一次。
 * 当 'anotherEvent' 事件第一次被触发时，此回调函数将被执行，之后将不再监听。
 * @param {string} data - 事件触发时传递的数据。
 */
myEmitter.once('anotherEvent', (data) => {
  console.log(`只执行一次的事件：${data}`);
});

// 触发事件
/**
 * 触发 'event' 事件。
 * 所有注册到 'event' 事件的监听器都将按注册顺序同步调用。
 * @param {string} msg - 传递给监听器的消息。
 */
myEmitter.emit('event', '第一次事件');
myEmitter.emit('event', '第二次事件');

/**
 * 触发 'anotherEvent' 事件。
 * 注册到 'anotherEvent' 事件的监听器（只会执行一次）将被调用。
 * @param {string} data - 传递给监听器的数据。
 */
myEmitter.emit('anotherEvent', '一次性事件数据');
myEmitter.emit('anotherEvent', '再次触发一次性事件 (不会有输出)');

// 移除事件监听器
/**
 * 移除所有 'event' 事件的监听器。
 * 之后再触发 'event' 事件将不会有任何输出。
 */
myEmitter.removeAllListeners('event');
myEmitter.emit('event', '这是在移除监听器后触发的事件 (不会有输出)');

console.log('\n----- 错误事件处理 -----\n');

/**
 * 监听 'error' 事件。
 * 当 EventEmitter 实例触发 'error' 事件时，如果没有监听器，Node.js 进程将崩溃。
 * 建议总是为 'error' 事件添加监听器。
 * @param {Error} err - 错误对象。
 */
myEmitter.on('error', (err) => {
  console.error('发生错误：', err.message);
});

/**
 * 触发 'error' 事件。
 * 这将调用上面注册的 'error' 事件监听器。
 * @param {Error} error - 自定义的错误对象。
 */
myEmitter.emit('error', new Error('Something bad happened!'));

console.log('\n----- 获取监听器数量 -----\n');

/**
 * 获取特定事件的监听器数量。
 * @param {string} eventName - 事件名称。
 * @returns {number} 监听器数量。
 */
console.log(`'error' 事件的监听器数量：${myEmitter.listenerCount('error')}`);
console.log(`'event' 事件的监听器数量：${myEmitter.listenerCount('event')}`);

// 异步事件监听器
/**
 * 注册一个异步事件监听器。
 * 虽然 EventEmitter 本身是同步的，但可以通过在回调中使用 setTimeout 等方式实现异步操作。
 * @param {string} msg - 异步事件触发时传递的消息。
 */
myEmitter.on('asyncEvent', (msg) => {
  setTimeout(() => {
    console.log(`异步事件收到：${msg}`);
  }, 100);
});

/**
 * 触发 'asyncEvent' 事件。
 * 异步监听器会在一段时间后执行。
 * @param {string} msg - 传递给异步监听器的消息。
 */
myEmitter.emit('asyncEvent', '异步操作数据');
console.log('异步事件已触发，等待回调...');
