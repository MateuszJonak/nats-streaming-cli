const natsStreaming = require('node-nats-streaming');

const once = fn => {
  let called = false;

  return (...args) => {
    if (!called) {
      called = true;

      return fn(...args);
    }
  };
};

class NATSStreamingClient {
  connect(clusterId, clientId, url) {
    return new Promise((resolve, reject) => {
      const rejectOnce = once(reject);
      const resolveOnce = once(resolve);

      this.client = natsStreaming.connect(
        clusterId,
        clientId,
        {
          url,
        },
      );

      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolveOnce();
      });
      this.client.on('disconnect', () => {
        console.log('Disconnected from NATS');
      });
      this.client.on('reconnecting', () => {
        console.log('Reconnecting to NATS');
      });
      this.client.on('reconnect', () => {
        console.log('Reconnected to NATS');
      });
      this.client.on('close', () => {
        rejectOnce('Connection to NATS closed');
      });
      this.client.on('error', error => {
        rejectOnce(error);
      });
    });
  };

  async publish(subject, message) {
    return new Promise((resolve, reject) => {
      this.client.publish(subject, message, function(err, guid){
        if(err) {
          return reject(err);
        }
        return resolve();
      });
    })

  }

  close() {
    if (this.client) {
      this.client.close();
    }
  };
}

module.exports = NATSStreamingClient;