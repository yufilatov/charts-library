import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ExampleDataService } from "src/examples/data-service";

interface MenuItem {
    path: string;
    label: string;
}

interface MenuGroup {
    id: string;
    title: string;
    items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
    {
        id: "bars",
        title: "Bars",
        items: [
            { path: "bar-horizontal", label: "Horizontal bar" },
            { path: "bar-vertical", label: "Vertical bar" },
            { path: "bar-simple", label: "Simple bar" },
            { path: "bar-progress", label: "Progress bar" },
        ],
    },
    {
        id: "lines",
        title: "Lines",
        items: [
            { path: "area", label: "Area" },
            { path: "line", label: "Line" },
            { path: "line-types", label: "Line types" },
        ],
    },
    {
        id: "circular",
        title: "Circular",
        items: [
            { path: "pie", label: "Pie" },
            { path: "donut", label: "Donut" },
            { path: "double-donut", label: "Double donut" },
            { path: "half-donut", label: "Half donut" },
            { path: "chord", label: "Chord" },
            { path: "circular-package", label: "Circular package" },
        ],
    },
    {
        id: "hierarchy",
        title: "Hierarchy",
        items: [
            { path: "icicle", label: "Icicle" },
            { path: "radial-tree", label: "Radial tree" },
            { path: "sunburst", label: "Sunburst" },
        ],
    },
    {
        id: "other",
        title: "Other",
        items: [
            { path: "map", label: "Map" },
            { path: "matrix", label: "Matrix" },
            { path: "word-cloud", label: "Word cloud" },
        ],
    },
    {
        id: "showcases",
        title: "Showcases",
        items: [
            { path: "league", label: "League simulation" },
            { path: "league-2024", label: "Champions League 2024" },
        ],
    },
];

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    providers: [ExampleDataService],
})
export class AppComponent {
    title = "charts-library";
    pages = ["Home", "Contacts", "About"];
    search = "";

    private readonly groups = MENU_GROUPS;
    private expanded: Record<string, boolean> = Object.fromEntries(
        MENU_GROUPS.map((group) => [group.id, true]),
    );

    get filteredGroups(): MenuGroup[] {
        const query = this.search.trim().toLowerCase();
        if (!query) {
            return this.groups;
        }

        return this.groups
            .map((group) => ({
                ...group,
                items: group.items.filter(
                    (item) =>
                        item.label.toLowerCase().includes(query) ||
                        item.path.toLowerCase().includes(query),
                ),
            }))
            .filter((group) => group.items.length > 0);
    }

    isExpanded(id: string): boolean {
        return this.search.trim().length > 0 || !!this.expanded[id];
    }

    toggleGroup(id: string): void {
        this.expanded = { ...this.expanded, [id]: !this.expanded[id] };
    }

    onSearch(event: Event): void {
        this.search = (event.target as HTMLInputElement).value;
    }

    clearSearch(): void {
        this.search = "";
    }
}
