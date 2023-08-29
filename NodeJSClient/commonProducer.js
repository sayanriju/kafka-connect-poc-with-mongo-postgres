const { Kafka } = require('kafkajs');
const cuid = require("cuid")
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['192.168.0.187:29092'], // Replace with your Kafka broker(s) information
});

const producer = kafka.producer();

const main = async () => {
  await producer.connect();

  const topic = process.argv[2] || 'my_topic'; // Replace with the topic you want to produce to
  // const message = process.argv[3]
  const message = {
    field1: 'arpita',
    field2: 'sayan',
    field3: 'didimoni'
  }



  try {
    await producer.connect();
    const value = JSON.stringify(message);
    await producer.send({
      topic: topic,
      messages: [{ value }],
    });
    console.log('Message sent successfully:', message);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});