const express = require('express');
const { Kafka } = require('kafkajs');
const cuid = require('cuid');

process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;

const app = express();
const port = 3000; // Change to the desired port number

// swagger setup
const { swaggerServe, swaggerSetup } = require("./swagger-ui-config")
app.use("/docs", swaggerServe, swaggerSetup)

// kafka code for produce message
const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: [process.env.KAFKA_LISTENER],
  // brokers: ['192.168.48.2:9092']
});

const producer = kafka.producer();

app.use(express.json());

app.post('/produce', async (req, res) => {
  const { message } = req.body;
  console.log("message..........==> ", message)

  if (message === undefined) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  try {
    await producer.connect();
    const value = JSON.stringify(message);
    await producer.send({
      topic: 'my_topic', 
      messages: [{ value }],
    });
    console.log('Message sent successfully:', message);
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, error: 'Error sending message' });
  } finally {
    await producer.disconnect();
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
