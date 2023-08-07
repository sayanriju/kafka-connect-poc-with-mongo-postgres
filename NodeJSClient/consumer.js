const { Kafka } = require('kafkajs')
const cuid = require("cuid")

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:19092'], // Replace with your Kafka broker(s) information
});

const consumer = kafka.consumer({ groupId: cuid() });

const main = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.argv[2] || 'my_topic', fromBeginning: false }); // Replace with the topic(s) you want to consume from

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(`Received message with key [${message.key}] from topic [${topic}] partition [${partition}]`);
      console.log(`Content: ${message.value.toString()}`);
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

      // Process the received message here

      consumer.commitOffsets([{ topic, partition, offset: message.offset + 1 }]);
    },
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
















