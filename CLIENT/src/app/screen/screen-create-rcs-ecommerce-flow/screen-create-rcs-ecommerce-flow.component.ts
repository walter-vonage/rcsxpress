import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { RCSModelForCard } from '../../models/rcs-model-for-card.interface';
import { ToastComponent } from '../../components/toast/toast.component';
import { OpenAiConversation } from '../../models/open-ai-conversation.interface';
import { InternetService } from '../../services/internet.service';
import { CommonFunctions } from '../../utils/commons';

export interface RcsFlow {
    flowId: string;
    name: string;
    start: string;
    steps: {
        [key: string]: {
            type: 'message' | 'wait' | 'card';
            text?: string;
            title?: string;
            description?: string;
            duration?: number;
            buttons?: Array<{ label: string; next: string }>;
            next?: string;
            end?: boolean;
        };
    };
}

export interface FlowECommerceInfo {
    id: number,                     //  12345
    title: string,                  //  Black Friday sale
    welcomeMessage: string,         //  👋 Hi there! Welcome to our Weekend Flash Sale!   
    conversation: [{
        keywords: Array<string>,    // ['start', 'menu'],
        actionId: string,           //  'showGroups'
    }],
    process: [{
        name: 'showGroups'
        title: 'Check out our top offers below 👇',
    }]
}

@Component({
    selector: 'app-screen-create-rcs-ecommerce-flow',
    templateUrl: './screen-create-rcs-ecommerce-flow.component.html',
    styleUrl: './screen-create-rcs-ecommerce-flow.component.scss'
})
export class ScreenCreateRcsEcommerceFlowComponent implements OnInit {

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
You are an expert in designing conversational RCS campaigns.

Your task is to create a **JSON flow** that represents a short, interactive RCS conversation.

OUTPUT RULES
-------------
- Output **only JSON** (no markdown, no prose, no comments).
- The JSON must be syntactically valid and follow this exact schema:

{
   "flowId": "<unique_id>",
  "name": "<short readable title>",
  "start": "<first_step_id>",
  "steps": {
    "<step_id>": {
      "type": "message" | "wait" | "card" | "checkout",
      "text": "<message text to send>",
      "title": "<optional card title>",
      "description": "<optional card description>",
      "duration": <milliseconds for waits>,
      "buttons": [
        {
          "label": "<button label>",
          "next": "<step_id>",
          "stateActions": [
            { "action": "addToBasket" | "removeFromBasket" | "clearBasket", "item": "<optional item name>" }
          ]
        }
      ],
      "next": "<step_id>",
      "end": true | false
    }
  }
}

DESIGN PRINCIPLES
-----------------
- 5–10 steps maximum.
- Always include friendly RCS-style emojis.
- Insert “wait” steps (800–1500 ms) between messages for pacing.
- Include at least one “card” with buttons.
- Use realistic product names and prices (e.g. “Wireless Headphones – £59”).
- Start with a greeting, present options, and **end with checkout and confirmation**.
- All "next" references must exist.
- Include 3–5 realistic items per category.

BASKET STATE ACTIONS
--------------------
You can simulate a shopping basket using \`stateActions\` on any button.
Each action updates the user's basket dynamically.

Valid actions:
- **addToBasket** → adds the given item name to the basket.
- **removeFromBasket** → removes the given item name from the basket.
- **clearBasket** → empties the basket.

Rules for basket usage:
- Whenever a user selects “✅ Reserve Now” or “Add to Basket”, include a stateAction:
  { "action": "addToBasket", "item": "<product_name> - £<price>" }
- When showing the Checkout step, assume all basket items will be displayed automatically.
- You can use “🛒 Added to your basket!” messages after add actions for feedback.
- Do not clear the basket until after checkout unless instructed.

MANDATORY CHECKOUT REQUIREMENTS
-------------------------------
⚠️ The flow **must contain a dedicated step with:**
{
  "type": "checkout",
  "title": "🛒 Checkout",
  "description": "Please review your reservation and complete payment.",
  "buttons": [
    { "label": "💳 Proceed to Payment", "next": "<confirmation_step_id>" },
    { "label": "⬅️ Back to Menu", "next": "step4" }
  ]
}

If the flow does **not** include this step, the output is invalid.

The flow must lead into this checkout step from every “reservation confirmed” message, 
and proceed to a final confirmation message afterwards (type: "message", end: true).

EXAMPLE OF A BUTTON WITH BASKET ACTION
--------------------------------------
{
  "label": "✅ Add to Basket",
  "next": "added_to_basket",
  "stateActions": [
    { "action": "addToBasket", "item": "Wireless Headphones - £59" }
  ]
}

Example output:
{
  "flowId": "weekend_flash_sale_v4",
  "name": "Weekend Flash Sale",
  "start": "step1",
  "steps": {
    "step1": {
      "type": "message",
      "text": "👋 Hi there! Welcome to our Weekend Flash Sale!",
      "next": "step2"
    },
    "step2": {
      "type": "wait",
      "duration": 1000,
      "next": "step3"
    },
    "step3": {
      "type": "message",
      "text": "We’ve got exclusive offers waiting for you 👇",
      "next": "step4"
    },
    "step4": {
      "type": "card",
      "title": "Choose a category",
      "buttons": [
        { "label": "👕 Apparel", "next": "apparel" },
        { "label": "🎧 Electronics", "next": "electronics" },
        { "label": "🏠 Home Essentials", "next": "home" }
      ]
    },

    "apparel": {
      "type": "message",
      "text": "👕 Great choice! Here are our apparel offers:",
      "next": "apparel_offers"
    },
    "electronics": {
      "type": "message",
      "text": "🔊 Great pick! Here are our top gadgets:",
      "next": "electronics_offers"
    },
    "home": {
      "type": "message",
      "text": "🏠 Nice! Here are our home essentials on sale:",
      "next": "home_offers"
    },

    "apparel_offers": {
      "type": "card",
      "title": "Top Apparel Picks",
      "buttons": [
        { "label": "Denim Jacket - £49", "next": "details_apparel_1" },
        { "label": "Casual T-shirt - £19", "next": "details_apparel_2" },
        { "label": "Leather Boots - £89", "next": "details_apparel_3" }
      ]
    },
    "electronics_offers": {
      "type": "card",
      "title": "Top Tech Deals",
      "buttons": [
        { "label": "Bluetooth Speaker - £39", "next": "details_electronics_1" },
        { "label": "Wireless Headphones - £59", "next": "details_electronics_2" },
        { "label": "Smartwatch - £99", "next": "details_electronics_3" }
      ]
    },
    "home_offers": {
      "type": "card",
      "title": "Home Essentials",
      "buttons": [
        { "label": "Aromatherapy Diffuser - £29", "next": "details_home_1" },
        { "label": "LED Desk Lamp - £35", "next": "details_home_2" },
        { "label": "Coffee Maker - £79", "next": "details_home_3" }
      ]
    },

    "details_apparel_1": {
      "type": "card",
      "title": "🧥 Denim Jacket",
      "description": "Stylish and durable, perfect for casual wear.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_apparel_1" },
        { "label": "⬅️ Back to Apparel", "next": "apparel_offers" }
      ]
    },
    "details_apparel_2": {
      "type": "card",
      "title": "👕 Casual T-shirt",
      "description": "Soft cotton T-shirt available in multiple colors.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_apparel_2" },
        { "label": "⬅️ Back to Apparel", "next": "apparel_offers" }
      ]
    },
    "details_apparel_3": {
      "type": "card",
      "title": "👢 Leather Boots",
      "description": "Premium leather boots, handcrafted for comfort.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_apparel_3" },
        { "label": "⬅️ Back to Apparel", "next": "apparel_offers" }
      ]
    },

    "details_electronics_1": {
      "type": "card",
      "title": "🔊 Bluetooth Speaker",
      "description": "Portable, powerful sound with deep bass.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_electronics_1" },
        { "label": "⬅️ Back to Electronics", "next": "electronics_offers" }
      ]
    },
    "details_electronics_2": {
      "type": "card",
      "title": "🎧 Wireless Headphones",
      "description": "High-quality sound and 20h battery life.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_electronics_2" },
        { "label": "⬅️ Back to Electronics", "next": "electronics_offers" }
      ]
    },
    "details_electronics_3": {
      "type": "card",
      "title": "⌚ Smartwatch",
      "description": "Track your fitness, heart rate, and messages.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_electronics_3" },
        { "label": "⬅️ Back to Electronics", "next": "electronics_offers" }
      ]
    },

    "details_home_1": {
      "type": "card",
      "title": "🏠 Aromatherapy Diffuser",
      "description": "Relaxing scents for your home or office.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_home_1" },
        { "label": "⬅️ Back to Home", "next": "home_offers" }
      ]
    },
    "details_home_2": {
      "type": "card",
      "title": "💡 LED Desk Lamp",
      "description": "Modern design with adjustable brightness.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_home_2" },
        { "label": "⬅️ Back to Home", "next": "home_offers" }
      ]
    },
    "details_home_3": {
      "type": "card",
      "title": "☕ Coffee Maker",
      "description": "Brew barista-quality coffee in minutes.",
      "buttons": [
        { "label": "✅ Reserve Now", "next": "reserved_home_3" },
        { "label": "⬅️ Back to Home", "next": "home_offers" }
      ]
    },

    "reserved_apparel_1": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Denim Jacket!",
      "next": "checkout"
    },
    "reserved_apparel_2": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Casual T-shirt!",
      "next": "checkout"
    },
    "reserved_apparel_3": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Leather Boots!",
      "next": "checkout"
    },
    "reserved_electronics_1": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Bluetooth Speaker!",
      "next": "checkout"
    },
    "reserved_electronics_2": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Wireless Headphones!",
      "next": "checkout"
    },
    "reserved_electronics_3": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Smartwatch!",
      "next": "checkout"
    },
    "reserved_home_1": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Aromatherapy Diffuser!",
      "next": "checkout"
    },
    "reserved_home_2": {
      "type": "message",
      "text": "🎉 Reservation confirmed for LED Desk Lamp!",
      "next": "checkout"
    },
    "reserved_home_3": {
      "type": "message",
      "text": "🎉 Reservation confirmed for Coffee Maker!",
      "next": "checkout"
    },

    "checkout": {
      "type": "checkout",
      "title": "🛒 Checkout",
      "description": "Please review your reservation and complete the payment.",
      "buttons": [
        { "label": "💳 Proceed to Payment", "next": "final" },
        { "label": "⬅️ Back to Menu", "next": "step4" }
      ]
    },

    "final": {
      "type": "message",
      "text": "🛍️ Thanks for shopping with us! Have a great day!",
      "end": true
    }
  }
}`
    /**
     * This is the message history in the current conversation
     */
    history: Array<OpenAiConversation> = []

    /**
     * This is to communicate with the component from the right
     */
    NotifyChangesInStorage = new EventEmitter();

    /**
     * This is the flow received by the AI with all
     * the eCommerce data.
     */
    flowFromAi: RcsFlow | null = null;


    constructor(
        private internet: InternetService
    ) { }

    ngOnInit(): void {
        this.sendWelcomeMessage();
        this.subscribe();
        setTimeout(() => {
            this.askAIToCreateBase();
        }, 5000)
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
    }

    /**
     * Shows a welcome message as if openai is talking
     */
    sendWelcomeMessage() {
        this.history.push({
            role: 'assistant',
            content: `<h5>Welcome!</h5> You are here to create a a beautiful flow for your e-Commerce. <br>
            Let me create a base for your. Then you can modify it.<br><br>
            It's going to take just a minute...
            `
        })
    }

    askAIToCreateBase() {
        const query = 'No input from user. Just create the flow.';
        const system = this.system;
        this.executeAI(query, system, this.history, (openaiResponse: string) => {
            const jsonResponse = CommonFunctions.parseIfJson(openaiResponse.replace(/^[^{]+/, ''));
            if (jsonResponse) {
                //  Agent is sending us a JSON element
                this.flowFromAi = jsonResponse;
                console.log(this.flowFromAi);
                //  Base is read
                this.history.push({
                  role: 'assistant',
                  content: 'Done! The flow on the right is fully functional. You can click the buttons and see the flow live.<br>Use the chat below to make changes or add or remove parts of the flow.'
              });    
            } else {
                //  Agent is sending a text - But it shouldn't
                ToastComponent.ShowToast.emit('The agent has sent an incorrect format. Unable to continue')
            }
        })
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
     * Sends the user input to openai
     */
    send() {
        if (this.query) {
            this.history.push({
                role: 'user',
                content: this.query
            });    
            this.history.push({
                role: 'assistant',
                content: 'Working on it...'
            });    
            const query = `Do the updates the user asks and return the flow updated.
User input: ${this.query}            
Current flow: ${JSON.stringify(this.flowFromAi)}`
            this.query = undefined;
            this.executeAI(query, this.system, this.history, (openaiResponse: string) => {
                const jsonResponse = CommonFunctions.parseIfJson(openaiResponse.replace(/^[^{]+/, ''));
                if (jsonResponse) {
                    this.flowFromAi = null;
                    setTimeout(() => {
                        //  Agent is sending us a JSON element
                        this.flowFromAi = jsonResponse;
                        console.log(this.flowFromAi);
                    }, 1000)
                    this.history.push({
                        role: 'assistant',
                        content: 'Done! The updated flow should appear on the right of the screen now.'
                    });            
                } else {
                    //  Agent is sending a text - But it shouldn't
                    ToastComponent.ShowToast.emit('The agent has sent an incorrect format. Unable to continue')
                }
                this.scrollToBottom();
            });
        }
    }

    /**
     * Sends any tet to the Agent
     * @param query 
     * @param addToHistory 
     * @param callback 
     */
    executeAI(query: string, system: string | null, history: Array<OpenAiConversation>, callback: any) {
        this.internet.sendOpenAi(query, history, system, (response: any) => {
            console.log(response)
            if (response && response.success) {
                const openaiResponse = response.response.reply;
                if (callback) {
                    callback(openaiResponse)
                }
            } else {
                ToastComponent.ShowToast.emit(response.message);
            }
        })
    }

}
