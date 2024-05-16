// consumer.js
const amqp = require('amqplib');

const rabbitmqUrl = 'amqp://localhost';
const queueName = 'chat';

async function startConsumingMessages(io, messages) {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        channel.consume(queueName, (message) => {
    if (message !== null) {
        const content = JSON.parse(message.content.toString());
        messages.push(content); // Stockage du message
        io.emit('chat message', content); // Émission du message à tous les clients connectés
        console.log('Message received from RabbitMQ:', content);
        channel.ack(message);
    }
});
    } catch (error) {
        console.error('Error consuming messages from RabbitMQ:', error);
    }
}

module.exports = {
    startConsumingMessages
};
