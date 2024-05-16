// producer.js
const amqp = require('amqplib');

const rabbitmqUrl = 'amqp://localhost';
const queueName = 'chat';

async function sendMessageToRabbitMQ(message) {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        // Convert the message object to a string
        const messageString = JSON.stringify(message);
        channel.sendToQueue(queueName, Buffer.from(messageString));
        console.log('Message sent to RabbitMQ:', message);
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
    }
}
module.exports = {
    sendMessageToRabbitMQ
};
