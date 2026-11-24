import { Component, OnInit } from "@angular/core";
import {
    Route,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from "@angular/router";
import { chartRoutes } from "./app.routes";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent implements OnInit {
    title = "charts-library";
    types: Route[] = [];

    pages = ["Home", "Contacts", "About"];

    ngOnInit(): void {
        this.types = chartRoutes;
    }
}
