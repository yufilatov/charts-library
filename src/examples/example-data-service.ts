import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

export interface SeasonData {
    club: string;
    twoLinesName: string;
    goals: {
        for: {
            home: number;
            away: number;
        },
        against: {
            home: number;
            away: number;
        }
    };
}

interface SeasonRawData {
    info: string;
    data: SeasonData[];
}
@Injectable()
export class ExampleDataService {
    constructor(private http: HttpClient) { }

    getData(season: string): Observable<SeasonData[]> {
        return this.http
            .get<SeasonRawData>(`assets/epl${season}.json`)
            .pipe(map(data => data.data));
    }

    getHistoryData(): Observable<any> {
        return this.http
            .get<any>(`assets/epl-clubs-position.json`)
            .pipe(map(data => data.data));
    }
}
