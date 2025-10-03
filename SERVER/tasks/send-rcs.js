import { sendRCSText, sendRCSVideo, sendRCSButtons, sendRCSCard, sendRCSCarousel, sendLocationShareRequest, sendCalendarEntry } from "../helpers/rcs-utils.js";

/**
 * Call this like this: 
 * {
 *      "action": "sendRCS",
 *      "to": "447375637447",
 *      "type": "text" | "video" | "buttons" | "card" | "carousel" | "location_share_request" | "calendar_entry",
 *      "payload": {} // Anything needed to send one of the types from above
 * }
 */
export async function run(data, req, res) {
    try {
        const {
            to,
            type,
            payload
        } = data;
        //  Validate
        if (!to || !type || !payload) {
            return res.status(200).json({
                success: false,
                message: 'Invalid data'
            })
        }
        if (type != "text" && type != "video" && type != "buttons" && type != "card" && type != "carousel" && type != "location_share_request" && type != "calendar_entry") {
            return res.status(200).json({
                success: false,
                message: 'Invalid RCS type'
            })
        }
        if (type == 'text') {
            const message = payload.message;
            const webhookUrl = payload.webhookUrl || null;
            if (!message) {
                return res.status(200).json({
                    success: false,
                    message: 'Missing field: message'
                })
            }
            sendRCSText(to, message, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        else if (type == 'video') {
            const videoUrl = payload.videoUrl;
            const webhookUrl = payload.webhookUrl || null;
            if (!videoUrl) {
                return res.status(200).json({
                    success: false,
                    message: 'Required field: payload.videoUrl'
                })
            }
            sendRCSVideo(to, videoUrl, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        else if (type == 'buttons') {
            const message = payload.message;
            const buttons = payload.buttons || null;
            const webhookUrl = payload.webhookUrl || null;
            if (!message || !buttons) {
                return res.status(200).json({
                    success: false,
                    message: 'Required field: payload.message, payload.buttons'
                })
            }
            sendRCSButtons(to, message, buttons, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        else if (type == 'card') {
            const card = payload.card || null;
            const webhookUrl = payload.webhookUrl || null;
            if (!card) {
                return res.status(200).json({
                    success: false,
                    message: 'Required field: payload.card'
                })
            }
            sendRCSCard(to, card, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        else if (type == 'carousel') {
            const cards = payload.cards || null;
            const webhookUrl = payload.webhookUrl || null;
            if (!cards) {
                return res.status(200).json({
                    success: false,
                    message: 'Required field: payload.cards'
                })
            }
            sendRCSCarousel(to, cards, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        else if (type == 'location_share_request') {
            const message = payload.message;
            const actionLabel = payload.actionLabel;
            const webhookUrl = payload.webhookUrl || null;
            if (!message || !actionLabel) {
                return res.status(200).json({
                    success: false,
                    message: 'Required field: payload.message, payload.actionLabel'
                })
            }
            sendLocationShareRequest(to, message, webhookUrl, (response) => {
                return res.status(200).json({
                    success: true,
                    response
                })
            })
        }

        //  TODO: Calendar entry

        else {

            res.status(200).json({
                success: false,
                message: 'Returning since there is nothing to do'
            })

        }
    } catch (ex) {
        console.log('UNEXPECTED ERROR IN FILE: ' + import.meta.url)
        console.log(ex.message)
        res.status(200).json({
            success: false,
            message: 'Unexpected error'
        })
    }
}
