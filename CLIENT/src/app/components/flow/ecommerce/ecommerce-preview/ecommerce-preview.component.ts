import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ecommerce-preview',
    templateUrl: './ecommerce-preview.component.html',
    styleUrl: './ecommerce-preview.component.scss'
})
export class EcommercePreviewComponent implements OnInit {

    @Input() flow: any;

    visibleSteps: any[] = [];   // steps shown on screen
    currentStepId: string | null = null;
    running = false;

    basket: string[] = [];

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        if (this.flow) {
            this.startFlow();
        }
    }

    async startFlow() {
        this.visibleSteps = [];
        this.currentStepId = this.flow.start;
        if (this.currentStepId) {
            this.running = true;
            this.changeDetectorRef.detectChanges();
            await this.runStep(this.currentStepId);
        }
    }

    async runStep(stepId: string) {
        if (!this.flow?.steps) return;

        const step = this.flow.steps[stepId];
        if (!step) return console.warn('Step not found:', stepId);

        // Add step to the visible list so user sees it
        this.visibleSteps.push(step);

        // Automatically scroll down (optional)
        setTimeout(() => {
            const container = document.querySelector('.container');
            if (container) container.scrollTop = container.scrollHeight;
        });

        // Handle WAIT step
        if (step.type === 'wait') {
            const waitMs = step.duration || 1000;
            await new Promise(res => setTimeout(res, waitMs));

            // Automatically continue to next step after waiting
            if (step.next) {
                await this.runStep(step.next);
            }
            return; // stop further manual flow for this step
        }

        // Handle MESSAGE, CARD, CHECKOUT, etc.
        // These types don't auto-progress unless triggered by user (button)
        if (step.next && (step.type === 'message')) {
            // Auto-continue simple messages (optional)
            await new Promise(res => setTimeout(res, 400)); // small pacing delay
            await this.runStep(step.next);
        }
    }


    async onButtonClick(button: any) {
        // 1. Handle basket-related state actions
        if (button.stateActions && Array.isArray(button.stateActions)) {
            for (const act of button.stateActions) {
                switch (act.action) {
                    case 'addToBasket':
                        if (act.item) {
                            // initialize basket if not already defined
                            this.basket = this.basket || [];
                            // prevent duplicates (optional)
                            if (!this.basket.includes(act.item)) {
                                this.basket.push(act.item);
                            }
                        }
                        break;

                    case 'removeFromBasket':
                        if (act.item && this.basket) {
                            this.basket = this.basket.filter(i => i !== act.item);
                        }
                        break;

                    case 'clearBasket':
                        this.basket = [];
                        break;

                    default:
                        console.warn('Unknown state action:', act);
                        break;
                }
            }
        }

        // 2. Continue flow navigation as usual
        this.currentStepId = button.next;
        if (this.currentStepId) {
            this.changeDetectorRef.detectChanges();
            await this.runStep(this.currentStepId);
        }
    }


}