# RCSXpress

This project is a small **Express + Angular app** for sending and receiving RCS messages, with an AI assistant integration.

## 📦 Requirements

- Node.js (>= 18)
- npm or yarn
- An `.env` file with your environment variables (API keys, ports, etc.)  


Example `.env`:

```
PORT=3020
RCS_FROM=447000000000
RCS_JWT=your-vonage-jwt-token-here
```

---

## Run the Server

Install dependencies:

```bash
cd SERVER
npm install
```

Start the server:

```bash
node index.js
```

By default the server runs on:

```
http://localhost:3020
```

## 📡 API Endpoints

The Angular client will call the API through `POST /api/v1` with an `action` and `data` payload.

### Send RCS
```json
{
  "action": "SendRCS",
  "data": {
    "to": "447375637234",
    "type": "text",
    "payload": {
      "message": "Hello from RCS"
    }
  }
}
```

### OpenAI Assistant
```json
{
  "action": "ReceiveUserQuestion",
  "data": {
    "query": "This is the user question",
    "system": "This is the main training for the AI",
    "history": []
  }
}
```


## Frontend
The frontend is an Angular application running with Bootstrap for CSS.

## Run the Client

Install dependencies:

```bash
cd CLIENT
npm install
```

Start the client:

```bash
ng serve
```

By default the client runs on:

```
http://localhost:4200
```

The Angular component (`screen-create-rcs-card.component`) gives you a simple chat interface:

- Left side: chat history with auto-scroll  
- Right side: history of RCS messages sent  
- Input box: type and press **Enter** or click **Send**  

---

## 🛠️ Development Notes

- Tasks are registered dynamically in [`task-regitry.js`](./task-regitry.js).  
- New tasks can be added under `tasks/` and exported in the registry.  
- Errors are logged with the file path using `import.meta.url`.

---

## ✅ Health Checks

The server exposes:

- `GET /_/health` → returns 200  
- `GET /_/metrics` → returns 200  

---
