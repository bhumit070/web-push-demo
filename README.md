#Web Push Demo

This is a demo of the Web Push API. It is a simple web app that allows you to subscribe to push notifications and send push notifications to your subscribed devices.

## Setup

run this code to generate your public and private push keys

```javascript
var vapidKeys = webpush.generateVAPIDKeys();
```

in frontend in index.js search for this code

```javascript
await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: '<Your VAPID Public Key>'
			})
```

and replace `<Your VAPID Public Key>` with your public key

put those keys in .env file

```bash
PUBLIC_KEY=your_public_key
PRIVATE_KEY=your_private_key
```

and then run demo

for backend

```bash
yarn && node .
```

and for frontend
use live server for vscode