const { Kafka } = require('kafkajs');
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:19092'], // Replace with your Kafka broker(s) information
});

const producer = kafka.producer();

const main = async () => {
  await producer.connect();

  const topic = process.argv[2] || 'my_topic_mongo'; // Replace with the topic you want to produce to
  // const message = process.argv[3]
  const message = {
    field1: 'value1',
    field2: 123,
    field3: true,
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