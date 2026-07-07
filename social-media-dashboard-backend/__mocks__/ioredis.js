class Redis {
  constructor() {}
  on() { return this; }
  get() { return null; }
  set() { return 'OK'; }
  del() { return 1; }
  quit() { return 'OK'; }
}

module.exports = Redis;
