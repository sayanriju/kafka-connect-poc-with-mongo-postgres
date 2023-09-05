const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDocs = YAML.load("kafkaswagger.yaml")


module.exports = { swaggerServe: swaggerUi.serve, swaggerSetup: swaggerUi.setup(swaggerJSDocs) }