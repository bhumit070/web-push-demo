const button = document.getElementById('button')
var isServiceWorkerAvailable = false;

window.onload = function () {
	registerServiceWorker()
	button.addEventListener('click', requestForNotificationPermission)
}

function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register("./worker.js")
			.then(function (registration) {
				isServiceWorkerAvailable = true
			})
	}
}

async function requestForNotificationPermission() {
	try {
		if (!isServiceWorkerAvailable) {
			return window.alert("We can not send notification to you because your browser does not support service worker")
		}

		const registration = await navigator.serviceWorker.ready

		const subscription = await registration.pushManager.getSubscription()
		let _subscription = null
		if (subscription) {
			_subscription = subscription
		} else {
			_subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: '<Your VAPID Public Key>'
			})
		}

		_subscription = _subscription.toJSON()

		await fetch('http://localhost:3000/subscription-endpoint', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(_subscription)
		})

		window.alert("You will receive notification from us")

	} catch (error) {
		console.error(error)
		window.alert("We can not send notification to you because your browser does not support service worker")
	}
}