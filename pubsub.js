const redis = require('redis'); 

// Define the channels used for messaging
const CHANNELS = {
  TEST: 'TEST', // Channel for test messages
  BLOCKCHAIN: 'BLOCKCHAIN' // Channel for blockchain updates
};

class PubSub {
  // Constructor takes the blockchain as a parameter
  constructor({ blockchain }) {
    this.blockchain = blockchain; // Store the blockchain instance

    // Create Redis publisher and subscriber clients
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Subscribe to all defined channels
    this.subscribeToChannels();

    // Set up the event listener for incoming messages
    this.subscriber.on(
      'message',
      (channel, message) => this.handleMessage(channel, message)
    );
  }

  // Handle incoming messages on subscribed channels
  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    // Parse the incoming message
    const parsedMessage = JSON.parse(message);

    // If the message is on the BLOCKCHAIN channel, update the local chain
    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  // Subscribe to all channels listed in the CHANNELS object
  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  // Publish a message to a specific channel
  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, ()=>{
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      });

    })

  }

  // Broadcast the current state of the blockchain to all subscribers
  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN, // Use the BLOCKCHAIN channel
      message: JSON.stringify(this.blockchain.chain) // Send the blockchain as a string
    });
  }
}

module.exports = PubSub; // Export the PubSub class for use in other files
