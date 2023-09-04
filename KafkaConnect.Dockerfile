FROM confluentinc/cp-kafka-connect:latest

RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:latest

RUN confluent-hub install --no-prompt mongodb/kafka-connect-mongodb:latest


ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"

