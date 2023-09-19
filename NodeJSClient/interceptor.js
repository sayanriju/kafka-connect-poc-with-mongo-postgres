const { Kafka } = require('kafkajs')
const cuid = require("cuid")

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: [process.env.KAFKA_LISTENER]
  // brokers: ['localhost:19092'], // Replace with your Kafka broker(s) information
});

const consumer = kafka.consumer({ groupId: "interceptor-consumer-group" });


// send message to postgres..............................

async function sendMsgToMPostgresTopic(givenMsg) {

  const producer = kafka.producer();

  const postgresmain = async () => {
    // console.log("givenMsg ==> ", givenMsg)
    await producer.connect();

    const topic = 'my_topic_postgres'; // Replace with the topic you want to produce to
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
      "payload": {
        id: cuid(),
        ...JSON.parse(givenMsg)
      }
    }



    try {
      await producer.connect();
      const value = JSON.stringify(message);
      await producer.send({
        topic: topic,
        messages: [{ value }],
      });
      console.log('PG Message sent successfully:', message);
    } catch (error) {
      console.error('PG Error sending message:', error);
    } finally {
      await producer.disconnect();
    }
  };

  postgresmain().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}


// send message to mongodb........................

async function sendMsgToMongoTopic(givenMsg) {
  console.log("givenMsg ==> ", givenMsg)

  const producer = kafka.producer();

  const mongomain = async () => {
    await producer.connect();

    const topic = 'my_topic_mongo'; // Replace with the topic you want to produce to
    // const message = process.argv[3]
    const message = givenMsg

    try {
      await producer.connect();
      const value = JSON.stringify(message);
      await producer.send({
        topic: topic,
        messages: [{ value }],
      });
      console.log('Mongo Message sent successfully:', message);
    } catch (error) {
      console.error('Mongo Error sending message:', error);
    } finally {
      await producer.disconnect();
    }
  };

  mongomain().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });

}

const main = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my_topic', fromBeginning: false }); // Replace with the topic(s) you want to consume from

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(`Received message with key [${message.key}] from topic [${topic}] partition [${partition}]`);
      console.log(`Content: ${message.value.toString()}`);
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
      const givenMsg = message.value.toString()
      await Promise.all([
        sendMsgToMPostgresTopic(givenMsg),
        sendMsgToMongoTopic(givenMsg)
      ])


      // Process the received message here

      consumer.commitOffsets([{ topic, partition, offset: message.offset + 1 }]);
    },
  });
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
















