import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {

    public static ShowToast = new EventEmitter<string | null>()

    private messages: Array<string> = [];
    message: string | null = null;

    //  Flags
    showUnauthorisedMessages = false;

    ngOnInit(): void {
        ToastComponent.ShowToast.subscribe((message: string | null) => {
            if (message) {
                if (!this.showUnauthorisedMessages && message.toLocaleLowerCase().indexOf('unauthorised') > -1) {
                    //  Don't show
                } else {
                    this.messages.push(message);
                }
            }
        })
        this.checkNewMessages();
    }

    toggleToast() {
        this.message = null;
    }

    checkNewMessages() {
        if (this.messages.length > 0) {
            const message = this.messages[0]
            this.message = message;
            setTimeout(() => {
                this.message = null;
                this.messages.splice(0, 1)
                this.checkAgain();
            }, 3 * 1000)
        } else {
            this.checkAgain();
        }
    }

    checkAgain() {
        setTimeout(() => {
            this.checkNewMessages();
        }, 100)
    }

}