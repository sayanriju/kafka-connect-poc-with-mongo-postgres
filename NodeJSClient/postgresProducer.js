const { Kafka } = require('kafkajs');
const cuid = require("cuid")
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['192.168.1.15:29092'], // Replace with your Kafka broker(s) information
});

const producer = kafka.producer();

const main = async () => {
  await producer.connect();

  const topic = process.argv[2] || 'my_topic_postgres'; // Replace with the topic you want to produce to
  // const message = process.argv[3]
  const message = {
    "schema": {
      "type": "struct",
      "fields": [
        {
          "type": "string",
          "optional": false,
          "field": "id"
        },
        {
          "type": "string",
          "optional": false,
          "field": "field1"
        },
        {
          "type": "string",
          "optional": false,
          "field": "field2"
        },
        {
          "type": "string",
          "optional": false,
          "field": "field3"
        }

      ]
    },
    "payload":
    {
      id: cuid(),
      field1: 'abc',
      field2: 'xyz',
      field3: 'pqr'
    }
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