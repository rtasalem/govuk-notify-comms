import { server } from './server.js'
import { ServiceBusClient } from '@azure/service-bus'
import dotenv from 'dotenv'

server.start()
console.log(`Server running on ${server.info.uri}`)

dotenv.config()

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING

const topicsAndSubscriptions = [
  { topic: process.env.TOPIC_1_NAME, subscription: process.env.TOPIC_1_SUBSCRIPTION },
  { topic: process.env.TOPIC_2_NAME, subscription: process.env.TOPIC_2_SUBSCRIPTION },
  { topic: process.env.TOPIC_3_NAME, subscription: process.env.TOPIC_3_SUBSCRIPTION }
]

const sbClient = new ServiceBusClient(connectionString)

const receiveMessagesFromTopic = async (topicName, subscriptionName) => {
    const receiver = sbClient.createReceiver(topicName, subscriptionName)

    try {
        console.log(`Listening to ${topicName}/${subscriptionName}...`)

        receiver.subscribe({
            async processMessage(message) {
                console.log(`Received message from ${topicName}/${subscriptionName}:`, message.body)
                await receiver.completeMessage(message)
            },
            async processError(error) {
                console.error(`Error receiving messages from ${topicName}/${subscriptionName}:`, error)
            }
        })
    } catch (error) {
        console.error(`Error setting up receiver for ${topicName}/${subscriptionName}:`, error)
    }
}
topicsAndSubscriptions.forEach(({ topic, subscription }) => {
    receiveMessagesFromTopic(topic, subscription)
})

process.on('SIGINT', async () => {
    console.log('Closing connections...')
    await sbClient.close()
    console.log('Connections closed. Exiting process.')
    process.exit(0)
})
