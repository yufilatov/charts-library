import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from './app-routing.module';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ],
})
export class AppComponent implements OnInit {
    title = 'charts-library';
    types = [];

    pages = ['Home', 'Contacts', 'About'];

    ngOnInit(): void {
        this.types = routes;
    }
}
