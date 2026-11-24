import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ExampleDataService } from "src/examples/data-service";
import { SeasonSelectComponent } from "./season-select/season-select.component";
import { MenuComponent } from "./menu/menucomponent";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports: [RouterLink, RouterLinkActive, RouterOutlet, SeasonSelectComponent, MenuComponent],
    providers: [ExampleDataService],
})
export class AppComponent {
    title = "charts-library";
    pages = ["Home", "Contacts", "About"];
}
