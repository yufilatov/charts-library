import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { convertUmlauts } from 'src/components/kit';
import * as d3 from 'd3';

@Component({
    selector: 'app-example-chart-map',
    templateUrl: './example-chart-map-series.component.html',
    styleUrls: [
        './example-chart-map-series.component.scss',
        '../../styles/germany-lands-logos.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartMapSeriesComponent implements OnInit {
    show = false;
    turbo;
    level: 'state' | 'district' = 'state';
    districts: any[] = null;

    stateColor = d3.scaleLinear()
        .domain([700000, 18100000])
        .range(['#c1a166', '#4c3100']);

    districtColor = d3.scaleSqrt()
        .domain([40000, 1000000])
        .range(['#c1a166', '#4c3100'])
        .clamp(true);

    color = this.stateColor;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d) => {
            const population = d.properties?.population;
            const district = this.level === 'district';

            return {
                fill: this.color(population == null ? this.color.domain()[0] : population),
                strokeWidth: district ? 0.5 : 1,
                stroke: district ? '#5c4314' : '#000000',
                fillHover: '#006666',
            };
        });

    constructor(
        private http: HttpClient,
        private cd: ChangeDetectorRef,
    ) { }

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
}
