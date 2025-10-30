import { ToastComponent } from "../components/toast/toast.component";
import { RCSModelForCard } from "../models/rcs-model-for-card.interface";
import { InternetService } from "../services/internet.service";

export class CommonFunctions {

    /**
     * Sends the RCS card to the user
     */
    public static sendRCSCard(internet: InternetService, jsonResponse: RCSModelForCard, continueWithNormalFlow: boolean, callback: any) {
        console.log('jsonResponse', jsonResponse)
        const to = jsonResponse.phoneToSendMessage;
        const suggestions = [];
        for (let button of jsonResponse.buttons) {
            if (button.type == 'reply') {
                suggestions.push({
                    reply: {
                        text: button.label,
                        postbackData: button.reply
                    }
                })
            }
            else if (button.type == 'url') {
                suggestions.push({
                    action: {
                        text: button.label,
                        postbackData: 'open_url',
                        openUrlAction: {
                            url: button.url
                        }
                    }
                })
            }
        }
        const payload = {
            card: {
                "title": jsonResponse.title,
                "description": jsonResponse.description,
                "media": {
                    "height": "MEDIUM",
                    "contentInfo": {
                        "fileUrl": jsonResponse.image,
                        "forceRefresh": "false"
                    }
                },
                "suggestions": suggestions,
            }
        }
        internet.sendRcsCard(to, payload, (response: any) => {
            if (response && response.success) {
                if (continueWithNormalFlow) {
                    callback({ success: true, to });
                } else {
                    ToastComponent.ShowToast.emit('Message sent!')
                }
            } else {
                ToastComponent.ShowToast.emit(response.message);
            }
        })
    }

    /**
     * Checks if the response from openai is a JSON with the final data
     */
    public static parseIfJson(str: string): any | null {
        if (!str) return null;
    
        // Remove Markdown fences like ```json ... ```
        const cleaned = str.replace(/```json|```/g, "");
    
        // Extract the substring that looks like JSON (first { ... last })
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
    
        if (start === -1 || end === -1 || end <= start) {
            return null;
        }
    
        const possibleJson = cleaned.substring(start, end + 1);
    
        try {
            return JSON.parse(possibleJson);
        } catch (e) {
            console.error("JSON parse failed:", e);
            return null;
        }
    }
}