/**
 * A module to encapsulate and abstract interaction with the keyboard. If you 
 * want an action to take place when certain keys are pressed you can use this 
 * module. For example
 * 
 * keyboard.on("Enter", () => {
 *   alert("You hit the enter key!");
 * });
 * 
 * keyboard.on("c", () => {
 *   alert("You hit the c key!");
 * });
*/

const keyboard = (function () {
  const events = {}

  /**
   * By default, a callback event will persist until you use the "off" function 
   * to remove your keyboard event. Pass in options = {once: true} and the 
   * callback event will be removed after the first call. 
   */
  const _options = { once: false };

  /**
   * Callbacks that are called only once will also be stored in this array. 
   * They will be removed after they are called. 
   */
  const _oneTimeCallbacks = [];

  const on = function (eventName, callBack, options = _options) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(callBack);

    if (options.once) {
      _oneTimeCallbacks.push(callBack);
    }
  }

  const off = function (eventName, callBack) {
    if (events[eventName] && events[eventName].includes(callBack)) {
      const eventsList = events[eventName];
      const index = events[eventName].indexOf(callBack);
      eventsList.splice(index, 1);
      // Remove the eventName list if it's now empty. 
      if (eventsList.length == 0) {
        delete eventsList[eventName];
      }
    }
  }

  const _emit = function (eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (callBack) {
        callBack(data);
        if (_oneTimeCallbacks.includes(callBack)) {
          _removeCallBack(callBack);
          off(eventName, callBack);
        }
      });
    }
  }

  const _removeCallBack = function (callBack) {
    const index = _oneTimeCallbacks.indexOf(callBack);
    _oneTimeCallbacks.splice(index, 1);
  }

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    _emit(key);
  });

  return { on, off }
})();

export { keyboard };