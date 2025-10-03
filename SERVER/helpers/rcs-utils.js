import axios from 'axios';

function sendRCSText(to, message, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        console.log('sendRCSText - Returning false')
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "text",
        "text": message,
        "to": to,
        "from": from,
        "channel": "rcs"
    });
    if (webhook_url) {
        data = JSON.stringify({
            "message_type": "text",
            "text": message,
            "to": to,
            "from": from,
            "channel": "rcs",
            "webhook_url": webhook_url
        });
    }
    sendRCS(data, callback);
}

function sendRCSVideo(to, videoUrl, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        console.log('sendRCSVideo - Returning false')
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "video",
        "video": {
            "url": videoUrl
        },
        "to": to,
        "from": from,
        "channel": "rcs"
    });
    if (webhook_url) {
        data = JSON.stringify({
            "message_type": "video",
            "video": {
                "url": videoUrl
            },
            "to": to,
            "from": from,
            "channel": "rcs",
            "webhook_url": webhook_url
        });
    }
    sendRCS(data, callback);
}

function sendRCSButtons(to, message, buttons, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to || !message) {
        return false;
    }
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

function sendRCSCard(to, card, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "custom",
        "custom": {
            "contentMessage": {
                "richCard": {
                    "standaloneCard": {
                        "thumbnailImageAlignment": "LEFT",
                        "cardOrientation": "VERTICAL",
                        "cardContent": card
                    }
                }
            }
        },
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    });
    sendRCS(data, callback);
}

function sendRCSCarousel(to, cards, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "custom",
        "custom": {
            "contentMessage": {
                "richCard": {
                    "carouselCard": {
                        "cardWidth": "MEDIUM",
                        "cardContents": cards
                    }
                }
            }
        },
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    })
    sendRCS(data, callback);
}

function sendLocationShareRequest(to, message, actionLabel, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "custom",
        "custom": {
            "contentMessage": {
                "text": message,
                "suggestions": [
                    {
                        "action": {
                            "text": actionLabel,
                            "postbackData": "location_data",
                            "shareLocationAction": {}
                        }
                    }
                ]
            }
        },
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    })
    sendRCS(data, callback);
}

function sendCalendarEntry(to, message, webhook_url, callback) {
    const from = process.env.RCS_FROM;
    if (!from || !to) {
        callback({
            success: false,
            message: 'Invalid data'
        })
        return false;
    }
    let data = JSON.stringify({
        "message_type": "custom",
        "custom": {
            "contentMessage": {
                "text": message,
                "suggestions": [
                    {
                        "action": {
                            "text": "Save to calendar",
                            "postbackData": "calendar_entry_clicked_christmas",
                            "fallbackUrl": "https://www.google.com/calendar",
                            "createCalendarEventAction": {
                                "startTime": "2024-12-24T08:00:00+02:00",
                                "endTime": "2024-12-26T20:00:00+02:00",
                                "title": "Vonage Christmas 🎄",
                                "description": "Come to Vonage Christmas and get some RCS gifts!\n\nAgenda:\n- 9am: RCS\n- 10am: RCS\n- 11am: RCS\n- Lunch: RCS & Food\n- Afternoon: More RCS and wine!\n\nProst! 🎅🍷"
                            }
                        }
                    }
                ]
            }
        },
        "to": to,
        "from": from,
        "channel": "rcs",
        "webhook_url": webhook_url
    })
    sendRCS(data, callback);
}

//
//  INTERNAL
//
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
        axios.request(config).then((response) => {
            console.log(JSON.stringify(response.data));
            callback({
                success: true,
                data: response.data
            })
        }).catch((error) => {
            console.log(error.message);
            callback({
                success: false,
                message: error.message
            })
        });
    } catch (ex) {
        console.log(ex.message);
        callback({
            success: false,
            message: ex.message
        })
    }
}
const generateToken = () => {
    return process.env.RCS_JWT;
}

export {
    sendRCSText,
    sendRCSVideo,
    sendRCSButtons,
    sendRCSCard,
    sendRCSCarousel,
    sendLocationShareRequest,
    sendCalendarEntry,
};

