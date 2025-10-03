import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { RCSModelForCard } from '../../models/rcs-model-for-card.interface';
import { ToastComponent } from '../../components/toast/toast.component';
import { OpenAiConversation } from '../../models/open-ai-conversation.interface';
import { InternetService } from '../../services/internet.service';

@Component({
    selector: 'app-screen-create-rcs-card',
    templateUrl: './screen-create-rcs-card.component.html',
    styleUrl: './screen-create-rcs-card.component.scss'
})
export class ScreenCreateRcsCardComponent implements OnInit, AfterViewInit {


    /**
     * Controls elements from the HTML
    */
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('inputBox') inputBox!: ElementRef<HTMLInputElement>;

    private autoScrollEnabled: boolean = true;

    /**
     * This is the text the user sends to openai
     */
    query: string | undefined;

    /**
     * This is the training for openai
     */
    system = `
    You are an assistant to help users create RCS Cards with buttons.
    You can talk to the user but get back to the conversation immediately.
    You can offer better option for the content sent by the user. To make the final card better.

    -----
    The necessary fields to complete the task are:
    - Card title.
    - Card description.
    - URL for the card image.
    - Action buttons: 
        a) These can be up to 10 buttons. 
        b) You need to ask for the button type. It can be one of 
            . "reply": This button will reply with a text (no longer thann 25 letters).
            . "url": This button will call a URL.
        c) You need to ask for a label for each button.
        d) Depending the button type, ask for the text to reply or the URL to open.
    - Optional: A full number (including country code) if the user wants to receive the card as a RCS message. Validate if the given number is invalid.

    -----
    Once you have all the information, respond with a single JSON object only. Example of response: {
        "title": "The title for the RCS Card",
        "description": "The description for the RCS Card",
        "image": "The URL for the RCS Card image",
        "buttons": [{
            "label": "This is the label for the button",
            "type": "reply",
            "reply": "button_1"
        }, {
            "label": "Open my website",
            "type": "url",
            "url": "https://myserver.com"
        }],
        "phoneToSendMessage": "07475637447"
    }    
    `

    /**
     * This is the message history in the current conversation
     */
    history: Array<OpenAiConversation> = []

    /**
     * This is to communicate with the component from the right
     */
    NotifyChangesInStorage = new EventEmitter();

    /**
     * The component from the right will trigger this
     * so a new message can be sent
     */
    ListenerForSendingRCSCards = new EventEmitter<RCSModelForCard>();

    constructor(
        private internet: InternetService
    ) { }

    ngOnInit(): void {
        this.sendWelcomeMessage();
        this.subscribe();
    }

    ngAfterViewInit() {
        this.scrollToBottom();
        // Track user scroll
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
            const el = this.scrollContainer.nativeElement;
            const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100; // threshold
            this.autoScrollEnabled = nearBottom;
        });
    }

    subscribe() {
        this.ListenerForSendingRCSCards.subscribe((card: RCSModelForCard) => {
            this.sendRCSCard(card, false);
        })
    }

    /**
     * Shows a welcome message as if openai is talking
     */
    sendWelcomeMessage() {
        this.history.push({
            role: 'assistant',
            content: `<h5>Welcome!</h5> So, you are here to create a RCS Card with action buttons, right?
            <p class="mt-3">Let's start: Type a title for your card...</p>
            `
        })
    }

    /**
     * Sends the user input to openai
     */
    send() {
        if (this.query) {
            this.history.push({
                role: 'user',
                content: this.query
            })
            let textToSend = this.query;
            if (this.history.length == 0) {
                //  We expect this to be the title
                textToSend = 'User offers this text: ' + this.query;
            }
            this.internet.sendOpenAi(textToSend, this.history, this.system, (response: any) => {
                console.log(response)
                if (response && response.success) {
                    const openaiResponse = response.response.reply;
                    const jsonResponse = this.parseIfJson(openaiResponse)
                    if (jsonResponse) {
                        this.sendRCSCard(jsonResponse, true);
                    } else {
                        this.history.push({
                            role: 'assistant',
                            content: openaiResponse
                        })
                    }
                    this.scrollToBottom();
                } else {
                    ToastComponent.ShowToast.emit(response.message);
                }
            })
            this.query = undefined;
        }
    }

    /**
     * Scrolls the chat history to the bottom
     */
    scrollToBottom() {
        if (!this.scrollContainer || !this.autoScrollEnabled) return;
        setTimeout(() => {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        }, 50);
    }

    /**
     * Simply adds focus to the chat input box
     */
    focusInputBox() {
        this.inputBox.nativeElement.focus();
    }

    /**
     * Checks if the response from openai is a JSON with the final data
     */
    parseIfJson(str: string): any | null {
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

    /**
     * Sends the RCS card to the user
     */
    sendRCSCard(jsonResponse: RCSModelForCard, continueWithNormalFlow: boolean) {
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
        this.internet.sendRcsCard(to, payload, (response: any) => {
            if (response && response.success) {
                if (continueWithNormalFlow) {
                    this.doAfterSendingRCS(to, jsonResponse);
                } else {
                    ToastComponent.ShowToast.emit('Message sent!')
                }
            } else {
                ToastComponent.ShowToast.emit(response.message);
            }
        })
    }

    /**
     * After sending the RCS message, clear the history 
     * and show some information on how to proceed.
     */
    doAfterSendingRCS(to: string, jsonResponse: RCSModelForCard) {
        this.history.push({
            role: 'assistant',
            content: `<h5>Great job!</h5> 
            <p class="mt-3">
                Your message was sent... Make sure this number "${to}" is enabled for receiving RCS messages and the Agent is open for everybody. 
            </p>
            <p class="mt-3">
                Now I'm ready to send another...
            </p>
            `
        })
        this.storeSentMessageInLocalhost(jsonResponse);
    }

    /**
     * Keep history of all the messages you are sending 
     * so you can send them again
     */
    storeSentMessageInLocalhost(jsonResponse: RCSModelForCard) {
        const RCSCardHistoryText: any = localStorage.getItem('rcs-card-history');
        let RCSCardHistory = [];
        try {
            if (RCSCardHistoryText) {
                RCSCardHistory = JSON.parse(RCSCardHistoryText);
            }
        } catch (ex) { }
        RCSCardHistory.push(jsonResponse);
        localStorage.setItem('rcs-card-history', JSON.stringify(RCSCardHistory));
        this.NotifyChangesInStorage.emit();
    }

}
