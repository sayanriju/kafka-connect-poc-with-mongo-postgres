const express = require('express');
const { Kafka } = require('kafkajs');
const cuid = require('cuid');
const path = require('path');
const fs = require('fs');
const YAML = require('yamljs'); 
const swaggerUi = require('swagger-ui-express');

process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;

const app = express();
const port = 3000; // Change to the desired port number

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: [process.env.KAFKA_LISTENER],
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


// Serve Swagger documentation
const filePath = path.join(__dirname, 'kafkaswagger.yaml');


if (fs.existsSync(filePath)) {
  const swaggerDocument = YAML.load(filePath);
  // Continue with your code
} else {
  console.error(`Swagger YAML file not found at: ${filePath}`);
}

// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'kafkaswagger.yaml'));

// Serve Swagger UI on a specific route
app.use('/swaggerdoc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// console.log('__dirname:', __dirname);
// console.log('Full path:', path.join(__dirname, 'kafkaswagger.yaml'));




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
