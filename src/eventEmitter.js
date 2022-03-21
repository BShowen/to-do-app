const emitter = (function () {
  const events = {}

  const on = function (eventName, callBack) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(callBack);
  }

  const emit = function (eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (callBack) {
        callBack(data);
      });
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

  /**
   * This app doesn't have a router. So, in order to reload a page I need to 
   * store reference to the last method that was called that loaded the page. 
   * This method will be updated every time a method renders a page. 
   */
  const reload = null;

  return { on, off, emit, reload, events }
})();

export default emitter;