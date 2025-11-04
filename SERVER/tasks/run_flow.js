import axios from 'axios';
import { data as Config } from '../config.js';
import { tokenGenerate } from '@vonage/jwt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'rob-dashboard-rcs-express-private.key'), 'utf8');
const applicationId = Config.APP_ID;

const sessions = {};
const storedFlows = {};

/**
 * STORE FLOW IS CALLED FROM ANGULAR
 */
export function storeFlow(userPhone, flow) {
    if (!userPhone || !flow) {
        console.error('Missing phone or flow in storeFlow');
        return;
    }
    // Save flow in memory
    storedFlows[userPhone] = flow;
    console.log(`Flow stored for ${userPhone} (${Object.keys(flow.steps).length} steps)`);
    // Optionally start it right away
    if (!sessions[userPhone]) {
        sessions[userPhone] = { flow, currentStepId: flow.start };
    }
}

/**
 * HANDLE WEBHOOKS FROM VONAGE
 */
export async function processWebhooks(req, res) {
    const data = req.body;

    const phone = data.from;
    const text = data.text || null;
    const replyId = data.reply?.id || null;
    const replyTitle = data.reply?.text || data.reply?.title || null;

    console.log('Webhook from:', phone, 'text:', text, 'reply:', replyTitle);

    // Ensure session exists
    if (!sessions[phone]) {
        console.log('No active session — starting new flow');

        //  Get the flow for this phone
        let flow = null;

        // Try to load flow from memory (storedFlows)
        if (storedFlows[phone]) {
            flow = storedFlows[phone];
            console.log(`Loaded flow from memory for ${phone}`);
        }

        // If no flow was found, fallback to default
        if (!flow) {
            console.log('No stored flow found — using default sample flow');
            return res.status(200).json({
                success: false,
                message: 'Flow not found for ' + phone
            })
        }

        startFlow(phone, flow);
        return res.status(200).json({ 
            success: true 
        });
    }

    const session = sessions[phone];
    const flow = session.flow;
    const currentStepId = session.currentStepId;
    const currentStep = flow.steps[currentStepId];

    // Handle button replies
    if (replyTitle || replyId) {
        const nextId = replyId || findNextId(flow, replyTitle);
        if (nextId) runStep(flow, phone, nextId);
        return res.status(200).json({ success: true });
    }

    // Handle text messages
    if (text && currentStep?.type === 'card') {
        // Try to match button by text
        const match = currentStep.buttons.find(b => b.label.toLowerCase() === text.toLowerCase());
        if (match) {
            runStep(flow, phone, match.next);
            return res.status(200).json({ success: true });
        }
    }

    res.status(200).json({ 
        success: true 
    });
}

function findNextId(flow, label) {
    for (const stepId in flow.steps) {
        const step = flow.steps[stepId];
        if (step.buttons) {
            const btn = step.buttons.find(b => b.label === label);
            if (btn) return btn.next;
        }
    }
    return null;
}

const generateToken = () => {
    if (Config.DEV) {
        return Config.JWT;
    } else {
        return tokenGenerate(applicationId, privateKey, {
            exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
        })
    }
}

function sendRCS(data, callback) {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.nexmo.com/v1/messages',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + generateToken()
            },
            data
        };
        axios.request(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                callback({ success: true, data: response.data });
            })
            .catch(error => {
                console.log(error.message);
                callback({ success: false, message: error.message });
            });
    } catch (ex) {
        console.log(ex.message);
        callback({ success: false, message: ex.message });
    }
}

function sendRCSButtons(to, message, buttons, webhook_url, callback) {
    const from = Config.FROM;
    if (!from || !to || !message) return false;

    let data = JSON.stringify({
        "message_type": "custom",
        "custom": {
            "contentMessage": {
                "text": message,
                "suggestions": buttons
            }
        },
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    });
    sendRCS(data, callback);
}

function sendRCSText(to, message, webhook_url, callback) {
    const from = Config.FROM;
    let data = JSON.stringify({
        "message_type": "text",
        "text": message,
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    });
    sendRCS(data, callback);
}

async function runStep(flow, phone, stepId) {
    const step = flow.steps[stepId];
    if (!step) return console.warn('Invalid step:', stepId);

    // Save current step in session
    sessions[phone].currentStepId = stepId;

    switch (step.type) {
        case 'message':
            sendRCSText(phone, step.text, Config.WEBHOOK_URL, () => {
                if (step.next) runStep(flow, phone, step.next);
            });
            break;

        case 'wait':
            setTimeout(() => {
                if (step.next) runStep(flow, phone, step.next);
            }, step.duration || 1000);
            break;

        case 'card':
        case 'checkout': {
            // Convert buttons into RCS suggestions
            const suggestions = step.buttons.map(b => ({
                reply: {
                    text: b.label,
                    postbackData: b.next
                }
            }));

            sendRCSButtons(phone, step.title || step.text || 'Choose an option:', suggestions, Config.WEBHOOK_URL, () => {
                console.log(`📤 Sent card with ${suggestions.length} buttons`);
            });
            break;
        }

        default:
            console.log('Unsupported step type:', step.type);
    }
}

export function startFlow(phone, flow) {
    sessions[phone] = { flow, currentStepId: flow.start };
    console.log(`Starting flow for ${phone}`);
    runStep(flow, phone, flow.start);
}
