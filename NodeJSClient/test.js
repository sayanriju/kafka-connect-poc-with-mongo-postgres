const { Kafka } = require('kafkajs');
const cuid = require('cuid');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:19092'], // Replace with your Kafka broker(s) information
});

const consumer = kafka.consumer({ groupId: cuid() });

async function sendMsgToMPostgresTopic(message) {
  const producer = kafka.producer();

  try {
    await producer.connect();
    const topic = process.argv[2] || 'my_topic_postgres';
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('Message sent successfully:', message);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

async function sendMsgToMongoTopic(message) {
  const producer = kafka.producer();

  try {
    await producer.connect();
    const topic = process.argv[2] || 'my_topic_mongo';
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('Message sent successfully:', message);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

const main = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.argv[2] || 'my_topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await Promise.all([
        sendMsgToMPostgresTopic(JSON.parse(message.value.toString())),
        sendMsgToMongoTopic(JSON.parse(message.value.toString())),
      ]);

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(`Received message with key [${message.key}] from topic [${topic}] partition [${partition}]`);
      console.log(`Content: ${message.value.toString()}`);
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

      consumer.commitOffsets([{ topic, partition, offset: message.offset + 1 }]);
    },
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
