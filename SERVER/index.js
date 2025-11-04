import express from "express";
import multer from "multer";
import cors from 'cors';
import "dotenv/config";
import { TasksRegistry } from "./task-regitry.js";
import { processWebhooks, startFlow, storeFlow } from "./tasks/run_flow.js";

// =============================
//  DO THE INIT
// =============================
const app = express();
app.use(express.json());
app.use(express.static("public"));
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Incoming origin:', origin);
        callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
const PORT = process.env.VCR_PORT || 3020;
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 1024 * 1024 * 1024
    }
}); // 1GB

// =============================
//  ALL POST GO HERE
// =============================
app.post('/api/v1', upload.single('file'), async (req, res) => {
    let { action, data } = req.body;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: 'Invalid JSON in "data" field'
            });
        }
    }
    await runTask(action, data, req, res);
})

// =============================
//  CREATE DYNAMIC INSTANCE OF TASK CLASSES
//  And pass the "data" along with "req" and "res"
// =============================
async function runTask(action, data, req, res) {
    console.log('Task to run', action)
    if (!action) {
        res.status(200).json({
            success: false,
            message: 'Invalid action'
        })
    }
    const task = TasksRegistry[action];
    if (task && typeof task.run === 'function') {
        await task.run(data, req, res);
    } else {
        res.status(200).json({
            success: false,
            message: action + ' not found'
        })
    }
}

//  ============================
//  VONAGE WEBHOOKS
//  ============================
app.post('/webhook', async (req, res) => {
    processWebhooks(req, res);
})

//  ============================
//  STORE THE FLOW FRM ANGULAR
//  ============================
app.post('/storeFlow', (req, res) => {
    const { userPhone, flow } = req.body;
    storeFlow(userPhone, flow);
    res.status(200).json({ success: true });
});

//  ============================
//  STARTS FLOW
//  ============================
app.post('/startFlow', (req, res) => {
    const { userPhone, flow } = req.body;
    startFlow(userPhone, flow);
    res.status(200).json({ success: true });
});

// =============================
// VCR utils
// =============================
app.get('/_/health', async (req, res) => {
    res.sendStatus(200);
})
app.get('/_/metrics', async (req, res) => {
    res.sendStatus(200);
})

// =============================
// Start Server
// =============================
app.listen(PORT, () => {
    console.log(`RCSXpress is running at http://localhost:${PORT}`);
});