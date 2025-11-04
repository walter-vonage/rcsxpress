import { Component, Input } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { InternetService } from '../../services/internet.service';

@Component({
    selector: 'app-stored-configurations',
    templateUrl: './stored-configurations.component.html',
    styleUrl: './stored-configurations.component.scss'
})
export class StoredConfigurationsComponent {

    @Input() flowFromAi: any;
    selectedName: string | null = null;
    selectedPhone: string | null = null;

    phoneList: Array<{ name: string, phone: string }> = [{
        name: 'Walter Rodriguez (UK)',
        phone: '447375637447'
    }, {
        name: 'Edem Banibah (Ghana)',
        phone: '233 24 652 7070'
    }, {
        name: 'Olivier Arnolin (UK',
        phone: '447920711882'
    }];

    constructor(
        private internet: InternetService
    ) {}

    selectPhone(item: any) {
        this.selectedName = item.name;
        this.selectedPhone = item.phone;
        console.log('Selected:', item);
        // Here you can emit it to parent or store it in a service
    }

    sendRCS() {
        if (!this.flowFromAi || !this.selectedPhone) {
            ToastComponent.ShowToast.emit('Must select a phone number and a flow first')
            return;
        }
        this.internet.storeFlow(this.selectedPhone, this.flowFromAi, (response: any) => {
            console.log(response);
            if (response && response.success) {
                if (this.flowFromAi && this.selectedPhone) {
                    this.internet.startFlow(this.selectedPhone, this.flowFromAi, (response: any) => {
                        console.log(response);
                        if (response && response.success) {
                            ToastComponent.ShowToast.emit('Check your phone!')
                        } else  {
                            ToastComponent.ShowToast.emit('Unable to store the flow! Contact us for help')
                        }            
                    })
                }
            } else {
                ToastComponent.ShowToast.emit('Unable to store the flow! Contact us for help')
            }
        })
    }
}
