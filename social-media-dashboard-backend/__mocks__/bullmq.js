class Queue {
  constructor(name) {
    this.name = name;
  }
  async add(name, data, opts) {
    return { id: 'mock-job-id', name, data, opts };
  }
  async getJob(id) {
    return { id, state: 'completed' };
  }
}

class Worker {
  constructor(name, processor, opts) {
    this.name = name;
  }
  on(event, callback) {
    return this;
  }
}

module.exports = {
  Queue,
  Worker,
};
