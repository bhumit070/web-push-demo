const express = require('express')
const cors = require('cors')
const webPush = require('web-push')

const WEB_PUSH_KEYS = {
	publicKey: process.env.PUBIC_KEY,
	privateKey: process.env.PRIVATE_KEY
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const subscriptions = []

app.post('/subscription-endpoint', handleSubscriptionEndpoint)
app.post('/send-notification', handleSendNotification)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})


function handleSubscriptionEndpoint(req, res) {
	const isExistingSubscription = subscriptions.find(subscription => subscription.endpoint === req.body.endpoint)
	if (!isExistingSubscription) {
		subscriptions.push(req.body)
	}
	res.status(200).json({ message: 'Subscription added successfully' })
}

async function handleSendNotification(req, res) {
	try {
		const title = req.body.title || 'Default title'
		const message = req.body.message || 'Default message'

		const payload = JSON.stringify({
			title,
			message
		})

		const promiseArr = []

		subscriptions.forEach(subscription => {
			promiseArr.push(
				webPush.sendNotification(subscription, payload, {
					vapidDetails: {
						subject: 'mailto:bhoomit.dev@gmail.com',
						publicKey: WEB_PUSH_KEYS.publicKey,
						privateKey: WEB_PUSH_KEYS.privateKey
					}
				})
			)
		})

		await Promise.allSettled(promiseArr)

		return res.status(200).json({ message: 'Notification sent successfully' })

	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Internal server error' })
	}
}