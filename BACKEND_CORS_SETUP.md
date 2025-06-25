# Backend CORS Configuration for Cloud Frontend

Your frontend is now configured to connect to your local backend at `192.168.1.125:8000`.

## Required Backend Configuration

To allow the cloud frontend to connect to your local backend, you need to configure CORS in your backend:

### 1. Update CORS Configuration

In your backend (likely in `main.py`, `app.py`, or `cors` configuration):

```python
# For Python/FastAPI backends
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://7fb6bf6978914ca48f089e6151180b03-a1b171efc67d4aea943f921a9.fly.dev",
        "http://localhost:5173",  # Local development
        "http://192.168.1.125:5173",  # Local network
        "*"  # Allow all origins (for testing only)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

```javascript
// For Node.js/Express backends
const cors = require("cors");

app.use(
  cors({
    origin: [
      "https://7fb6bf6978914ca48f089e6151180b03-a1b171efc67d4aea943f921a9.fly.dev",
      "http://localhost:5173",
      "http://192.168.1.125:5173",
    ],
    credentials: true,
  }),
);
```

### 2. Firewall Configuration

Make sure your firewall allows incoming connections on port 8000:

**Windows:**

```cmd
netsh advfirewall firewall add rule name="A1Betting Backend" dir=in action=allow protocol=TCP localport=8000
```

**Mac:**

```bash
sudo pfctl -f /etc/pf.conf
# Or disable firewall temporarily for testing
sudo pfctl -d
```

**Linux:**

```bash
sudo ufw allow 8000
# Or for specific IP
sudo ufw allow from 0.0.0.0/0 to any port 8000
```

### 3. Backend Binding

Make sure your backend is bound to `0.0.0.0:8000` not just `127.0.0.1:8000`:

```python
# FastAPI/Uvicorn
uvicorn.run(app, host="0.0.0.0", port=8000)
```

```javascript
// Express
app.listen(8000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:8000");
});
```

### 4. Test Connection

After making these changes, restart your backend and the frontend should connect automatically!

## Troubleshooting

1. **Check backend logs** for incoming requests
2. **Test direct access**: Try accessing `http://192.168.1.125:8000/health` in your browser
3. **Check network**: Make sure both machines are on the same network
4. **Router settings**: Some routers block inter-device communication

## Current Frontend Configuration

The frontend is now configured to connect to:

- **API**: `http://192.168.1.125:8000`
- **WebSocket**: `ws://192.168.1.125:8000`

The connection should work once CORS is properly configured on your backend!
