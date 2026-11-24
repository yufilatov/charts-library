import { NgClass } from '@angular/common';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { convertUmlauts } from 'src/components/kit';
import { ChartComponent } from 'src/components/chart/chart.component';
import { ChartPopupComponent } from 'src/components/chart-popup/chart-popup.component';
import { MapSeriesChartComponent } from 'src/components/series/map-series/map-series.component';
import * as d3 from 'd3';

@Component({
    selector: 'app-example-chart-map',
    templateUrl: './example-chart-map-series.component.html',
    styleUrls: [
        './example-chart-map-series.component.scss',
        '../../styles/germany-lands-logos.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, ChartComponent, MapSeriesChartComponent, ChartPopupComponent],
})
export class ExampleChartMapSeriesComponent implements OnInit {
    show = false;
    turbo;
    level: 'state' | 'district' = 'state';
    districts: any[] = null;

    stateColor = d3.scaleLinear<string>()
        .domain([700000, 6000000, 18100000])
        .range(['#f3ead7', '#c4a15a', '#1d3b2f']);

    districtColor = d3.scaleSqrt<string>()
        .domain([40000, 200000, 1000000])
        .range(['#f3ead7', '#c4a15a', '#1d3b2f'])
        .clamp(true);

    color = this.stateColor;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d) => {
            const population = d.properties?.population;
            const district = this.level === 'district';

            return {
                fill: this.color(population == null ? this.color.domain()[0] : population),
                strokeWidth: district ? 0.45 : 1.25,
                stroke: '#fbf8f2',
                fillHover: '#f4d27a',
            };
        });

    private readonly http = inject(HttpClient);
    private readonly cd = inject(ChangeDetectorRef);

    ngOnInit() {
        this.http.get<any>('assets/germany-districts.geo.json').subscribe(collection => {
            this.districts = collection.features;
            this.cd.markForCheck();
        });
    }

    get legend() {
        return this.level === 'district'
            ? [
                { label: '50k', color: this.districtColor(50000) },
                { label: '150k', color: this.districtColor(150000) },
                { label: '300k', color: this.districtColor(300000) },
                { label: '500k', color: this.districtColor(500000) },
                { label: '1M', color: this.districtColor(1000000) },
            ]
            : [
                { label: '4M', color: this.stateColor(4000000) },
                { label: '8M', color: this.stateColor(8000000) },
                { label: '12M', color: this.stateColor(12000000) },
                { label: '16M', color: this.stateColor(16000000) },
                { label: '20M', color: this.stateColor(18000000) },
            ];
    }

    get panelTitle() {
        if (!this.show) {
            return 'Germany';
        }

        return this.turbo?.properties?.name || 'Germany';
    }

    get panelSubtitle() {
        if (!this.show) {
            return 'Federal parliamentary republic';
        }

        if (this.level === 'district') {
            return this.turbo?.properties?.state || 'District';
        }

        return this.turbo?.properties?.capital ? `Capital · ${this.turbo.properties.capital}` : 'Federal state';
    }

    get mapData() {
        return this.level === 'district' ? this.districts : null;
    }

    setLevel(level: 'state' | 'district') {
        if (level === this.level || (level === 'district' && !this.districts)) {
            return;
        }

        this.level = level;
        this.color = level === 'district' ? this.districtColor : this.stateColor;
        this.show = false;
        this.turbo = null;
    }

    showData(data) {
        this.show = true;
        this.turbo = data;
    }

    logoName(feature) {
        if (!feature?.properties) {
            return '';
        }

        return this.level === 'district' ? feature.properties.state : feature.properties.name;
    }

    getLogo(name) {
        return name ? `logo logo-${convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }

    getLogoBig(name) {
        return name ? `logo-big logo-${convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }

    formatPopulation(value: unknown) {
        if (value == null || value === '') {
            return '—';
        }

        const number = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''));

        return Number.isFinite(number) ? new Intl.NumberFormat('en-US').format(number) : String(value);
    }
}
