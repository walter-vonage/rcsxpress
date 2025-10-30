import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-screen-home',
    templateUrl: './screen-home.component.html',
    styleUrl: './screen-home.component.scss'
})
export class ScreenHomeComponent {

    constructor(
        private router: Router
    ) {}

    menu = [{
        title: 'RCS Rich Cards',
        description: `Talk to an AI and create powerful RCS rich cards with action buttons`,
        route: 'new/rcs/card'
    }, {
        title: 'e-Commerce RCS Flow',
        description: `Talk to an AI and create powerful e-Commerce flows`,
        route: 'new/rcs/flow/ecommerce'
    }]

    goto(route: string) {
        this.router.navigate([route])
    }

}
