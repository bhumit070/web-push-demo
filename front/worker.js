
self.addEventListener("push", handleIncomingNotification)


function handleIncomingNotification(notificationEvent) {
	const data = notificationEvent.data.json()
	notificationEvent.waitUntil(self.registration.showNotification(data.title, {
		body: data.message,
		icon: "https://cdn-icons-png.flaticon.com/512/599/599502.png"
	}))
}