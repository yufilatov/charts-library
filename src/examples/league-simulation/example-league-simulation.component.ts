import { DATA } from './data';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
    selector: 'app-example-league-simulation',
    templateUrl: './example-league-simulation.component.html',
    styleUrls: ['./example-league-simulation.component.scss', '../../styles/epl-emblems.scss', '../../styles/champions-league-logos.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExampleLeagueSimulationComponent implements OnInit {
    data = DATA;
    day = 1;
    checked = true;
    letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    groups = [];
    next = [];

    roundOf16 = [];
    roundOf8 = [];
    roundOf4 = [];
    roundOf2 = {};

    roundOf16Teams = [[], []];
    roundOf8Teams = [];
    roundOf4Teams = [];
    roundOf2Teams = [];
    winner = {};

    results = [];

    teamsLeft = [];

    startDraw;
    drawFast;
    sortDataPlayoff;

    ngOnInit() {
        let pot1 = this.data.filter(a => a.pot === 1);
        const pot2 = this.data.filter(a => a.pot === 2);
        const pot3 = this.data.filter(a => a.pot === 3);
        const pot4 = this.data.filter(a => a.pot === 4);

        const group1 = [];
        let group2 = [];
        let group3 = [];
        let group4 = [];

        for (let i = 0; i < 8; i++) {
            this.groups.push([]);
        }

        this.data.forEach(team => team = Object.assign(
            team,
            {
                points: 0,
                goals: [0, 0],
                pointsPerTeam: [0, 0, 0, 0],
                goalsDifferencePerTeam: [0, 0, 0, 0],
                awayGoalsPerTeam: [0, 0, 0, 0],
            }));

        for (const [i, group] of this.groups.entries()) {
            const team1 = pot1[Math.floor(Math.random() * pot1.length)];
            group1.push(team1);
            pot1 = pot1.filter(a => a.name !== team1.name);
        }

        const full = (pot, index) => {
            let potCopy = [...pot];
            for (let i = 0; i < 8; i++) {
                const countriesLeftForPot = index === 1 ?
                    [...potCopy].filter(a =>
                        a.shortCountryName !== group1[i].shortCountryName) : index === 2 ?
                        [...potCopy].filter(a =>
                            a.shortCountryName !== group1[i].shortCountryName &&
                            a.shortCountryName !== group2[i].shortCountryName) :
                        [...potCopy].filter(a =>
                            a.shortCountryName !== group1[i].shortCountryName &&
                            a.shortCountryName !== group2[i].shortCountryName &&
                            a.shortCountryName !== group3[i].shortCountryName);

                if (countriesLeftForPot.length === 0) {
                    for (let j = 0; j < 8; j++) {
                        if (index === 1) {
                            group2 = [];
                        } else {
                            if (index === 2) {
                                group3 = [];
                            } else {
                                group4 = [];
                            }
                        }
                    }
                    full(pot, index);
                    break;
                }

                const team = countriesLeftForPot[Math.floor(Math.random() * countriesLeftForPot.length)];
                potCopy = potCopy.filter(a => a.name !== team.name);

                if (index === 1) {
                    group2.push(team);
                } else {
                    if (index === 2) {
                        group3.push(team);
                    } else {
                        group4.push(team);
                    }
                }
            }
        };

        full(pot2, 1);
        full(pot3, 2);
        full(pot4, 3);

        let t1 = []; let t2 = []; let t3 = []; let t4 = [];

        this.startDraw = (index) => {
            for (let i = 0; i < 8; i++) {
                t1.push(setTimeout(() => this.groups[i].push(group1[i]), i * 1000 * index));
                t2.push(setTimeout(() => this.groups[i].push(group2[i]), (i + 8) * 1000 * index));
                t3.push(setTimeout(() => this.groups[i].push(group3[i]), (i + 16) * 1000 * index));
                t4.push(setTimeout(() => this.groups[i].push(group4[i]), (i + 24) * 1000 * index));
            }
        };

        this.drawFast = () => {
            t2 = t2.map(a => clearTimeout(a));
            t1 = t1.map(a => clearTimeout(a));
            t3 = t3.map(a => clearTimeout(a));
            t4 = t4.map(a => clearTimeout(a));

            for (let i = 0; i < 8; i++) {
                this.groups[i] = [];
            }

            this.startDraw(0);
        };
    }

    sortData(index: number) {
        return this.data.filter(a => a.pot === index);
    }

    sort(data) {
        if (this.day === 1) {
            return [...data].sort((a, b) => a.name.localeCompare(b.name));
        } else {
            return [...data].sort((a, b) => {
                if (a.points > b.points) {
                    return -1;
                } else {
                    if (a.points < b.points) {
                        return 1;
                    } else {
                        if (a.pointsPerTeam[b.pot - 1] > b.pointsPerTeam[a.pot - 1]) {
                            return -1;
                        } else {
                            if (a.pointsPerTeam[b.pot - 1] < b.pointsPerTeam[a.pot - 1]) {
                                return 1;

                            } else {
                                if (a.goalsDifferencePerTeam[b.pot - 1] > b.goalsDifferencePerTeam[a.pot - 1]) {
                                    return -1;
                                } else {
                                    if (a.goalsDifferencePerTeam[b.pot - 1] < b.goalsDifferencePerTeam[a.pot - 1]) {
                                        return 1;
                                    } else {
                                        if (a.awayGoalsPerTeam[b.pot - 1] > b.awayGoalsPerTeam[a.pot - 1]) {
                                            return -1;
                                        } else {
                                            if (a.awayGoalsPerTeam[b.pot - 1] < b.awayGoalsPerTeam[a.pot - 1]) {
                                                return 1;
                                            } else {
                                                if (a.goals[0] - a.goals[1] > b.goals[0] - b.goals[1]) {
                                                    return -1;
                                                } else {
                                                    if (a.goals[0] - a.goals[1] < b.goals[0] - b.goals[1]) {
                                                        return 1;
                                                    } else {
                                                        if (a.goals[0] > b.goals[0]) {
                                                            return -1;
                                                        } else {
                                                            if (a.goals[0] < b.goals[0]) {
                                                                return 1;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    simulate(day) {
        switch (day) {
            case 1: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][0].points = this.groups[i][0].points + 3;
                        this.groups[i][0].pointsPerTeam[1] = this.groups[i][0].pointsPerTeam[1] + 3;
                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][1].points = this.groups[i][1].points + 3;
                            this.groups[i][1].pointsPerTeam[0] = this.groups[i][1].pointsPerTeam[0] + 3;

                        } else {
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][2].points = this.groups[i][2].points + 3;
                        this.groups[i][2].pointsPerTeam[3] = this.groups[i][2].pointsPerTeam[3] + 3;

                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][3].points = this.groups[i][3].points + 3;
                            this.groups[i][3].pointsPerTeam[2] = this.groups[i][3].pointsPerTeam[2] + 3;

                        } else {
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                        }
                    }

                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult1HomeTeam;
                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult1AwayTeam;
                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult2HomeTeam;
                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult2AwayTeam;

                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult1HomeTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult1AwayTeam;
                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult2HomeTeam;
                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult2AwayTeam;

                    this.groups[i][0].goalsDifferencePerTeam[1] = this.groups[i][0].goalsDifferencePerTeam[1] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][1].goalsDifferencePerTeam[0] = this.groups[i][1].goalsDifferencePerTeam[0] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][2].goalsDifferencePerTeam[3] = this.groups[i][2].goalsDifferencePerTeam[3] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][3].goalsDifferencePerTeam[2] = this.groups[i][3].goalsDifferencePerTeam[2] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][1].awayGoalsPerTeam[0] = this.groups[i][1].awayGoalsPerTeam[0] + matchResult1AwayTeam;
                    this.groups[i][3].awayGoalsPerTeam[2] = this.groups[i][3].awayGoalsPerTeam[2] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][0].name}`, team2: `${this.groups[i][1].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][2].name}`, team2: `${this.groups[i][3].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                break;
            }
            case 2: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][1].points = this.groups[i][1].points + 3;
                        this.groups[i][1].pointsPerTeam[2] = this.groups[i][1].pointsPerTeam[2] + 3;

                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][2].points = this.groups[i][2].points + 3;
                            this.groups[i][2].pointsPerTeam[1] = this.groups[i][2].pointsPerTeam[1] + 3;

                        } else {
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][3].points = this.groups[i][3].points + 3;
                        this.groups[i][3].pointsPerTeam[0] = this.groups[i][3].pointsPerTeam[0] + 3;

                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][0].points = this.groups[i][0].points + 3;
                            this.groups[i][0].pointsPerTeam[3] = this.groups[i][0].pointsPerTeam[3] + 3;

                        } else {
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                        }
                    }

                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult1HomeTeam;
                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult1AwayTeam;
                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult2HomeTeam;
                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult2AwayTeam;

                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult1AwayTeam;
                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult1HomeTeam;
                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult2AwayTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult2HomeTeam;

                    this.groups[i][1].goalsDifferencePerTeam[2] = this.groups[i][1].goalsDifferencePerTeam[2] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][2].goalsDifferencePerTeam[1] = this.groups[i][2].goalsDifferencePerTeam[1] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][3].goalsDifferencePerTeam[0] = this.groups[i][3].goalsDifferencePerTeam[0] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][0].goalsDifferencePerTeam[3] = this.groups[i][0].goalsDifferencePerTeam[3] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][2].awayGoalsPerTeam[1] = this.groups[i][2].awayGoalsPerTeam[1] + matchResult1AwayTeam;
                    this.groups[i][0].awayGoalsPerTeam[3] = this.groups[i][0].awayGoalsPerTeam[3] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][1].name}`, team2: `${this.groups[i][2].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][3].name}`, team2: `${this.groups[i][0].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                break;
            }
            case 3: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][3].points = this.groups[i][3].points + 3;
                        this.groups[i][3].pointsPerTeam[1] = this.groups[i][3].pointsPerTeam[1] + 3;

                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][1].points = this.groups[i][1].points + 3;
                            this.groups[i][1].pointsPerTeam[3] = this.groups[i][1].pointsPerTeam[3] + 3;

                        } else {
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][2].points = this.groups[i][2].points + 3;
                        this.groups[i][2].pointsPerTeam[0] = this.groups[i][2].pointsPerTeam[0] + 3;

                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][0].points = this.groups[i][0].points + 3;
                            this.groups[i][0].pointsPerTeam[2] = this.groups[i][0].pointsPerTeam[2] + 3;

                        } else {
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                        }
                    }

                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult1HomeTeam;
                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult1AwayTeam;
                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult2HomeTeam;
                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult2AwayTeam;

                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult1AwayTeam;
                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult1HomeTeam;
                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult2AwayTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult2HomeTeam;

                    this.groups[i][3].goalsDifferencePerTeam[1] = this.groups[i][3].goalsDifferencePerTeam[1] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][1].goalsDifferencePerTeam[3] = this.groups[i][1].goalsDifferencePerTeam[3] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][2].goalsDifferencePerTeam[0] = this.groups[i][2].goalsDifferencePerTeam[0] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][0].goalsDifferencePerTeam[2] = this.groups[i][0].goalsDifferencePerTeam[2] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][3].awayGoalsPerTeam[1] = this.groups[i][3].awayGoalsPerTeam[1] + matchResult1AwayTeam;
                    this.groups[i][2].awayGoalsPerTeam[0] = this.groups[i][2].awayGoalsPerTeam[0] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][3].name}`, team2: `${this.groups[i][1].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][2].name}`, team2: `${this.groups[i][0].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                break;
            }
            case 4: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][1].points = this.groups[i][1].points + 3;
                        this.groups[i][1].pointsPerTeam[3] = this.groups[i][1].pointsPerTeam[3] + 3;
                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][3].points = this.groups[i][3].points + 3;
                            this.groups[i][3].pointsPerTeam[1] = this.groups[i][3].pointsPerTeam[1] + 3;

                        } else {
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][0].points = this.groups[i][0].points + 3;
                        this.groups[i][0].pointsPerTeam[2] = this.groups[i][0].pointsPerTeam[2] + 3;

                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][2].points = this.groups[i][2].points + 3;
                            this.groups[i][2].pointsPerTeam[0] = this.groups[i][2].pointsPerTeam[0] + 3;

                        } else {
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                        }
                    }

                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult1HomeTeam;
                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult1AwayTeam;
                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult2HomeTeam;
                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult2AwayTeam;

                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult1AwayTeam;
                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult1HomeTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult2AwayTeam;
                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult2HomeTeam;

                    this.groups[i][1].goalsDifferencePerTeam[3] = this.groups[i][1].goalsDifferencePerTeam[3] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][3].goalsDifferencePerTeam[1] = this.groups[i][3].goalsDifferencePerTeam[1] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][0].goalsDifferencePerTeam[2] = this.groups[i][0].goalsDifferencePerTeam[2] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][2].goalsDifferencePerTeam[0] = this.groups[i][2].goalsDifferencePerTeam[0] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][1].awayGoalsPerTeam[3] = this.groups[i][1].awayGoalsPerTeam[3] + matchResult1AwayTeam;
                    this.groups[i][2].awayGoalsPerTeam[0] = this.groups[i][2].awayGoalsPerTeam[0] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][1].name}`, team2: `${this.groups[i][3].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][0].name}`, team2: `${this.groups[i][2].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                break;
            }
            case 5: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][3].points = this.groups[i][3].points + 3;
                        this.groups[i][3].pointsPerTeam[2] = this.groups[i][3].pointsPerTeam[2] + 3;
                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][2].points = this.groups[i][2].points + 3;
                            this.groups[i][2].pointsPerTeam[3] = this.groups[i][2].pointsPerTeam[3] + 3;
                        } else {
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][1].points = this.groups[i][1].points + 3;
                        this.groups[i][1].pointsPerTeam[0] = this.groups[i][1].pointsPerTeam[0] + 3;
                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][0].points = this.groups[i][0].points + 3;
                            this.groups[i][0].pointsPerTeam[1] = this.groups[i][0].pointsPerTeam[1] + 3;
                        } else {
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                        }
                    }

                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult1HomeTeam;
                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult1AwayTeam;
                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult2HomeTeam;
                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult2AwayTeam;

                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult1AwayTeam;
                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult1HomeTeam;
                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult2AwayTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult2HomeTeam;

                    this.groups[i][3].goalsDifferencePerTeam[2] = this.groups[i][3].goalsDifferencePerTeam[2] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][2].goalsDifferencePerTeam[3] = this.groups[i][2].goalsDifferencePerTeam[3] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][1].goalsDifferencePerTeam[0] = this.groups[i][1].goalsDifferencePerTeam[0] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][0].goalsDifferencePerTeam[1] = this.groups[i][0].goalsDifferencePerTeam[1] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][3].awayGoalsPerTeam[2] = this.groups[i][3].awayGoalsPerTeam[2] + matchResult1AwayTeam;
                    this.groups[i][0].awayGoalsPerTeam[1] = this.groups[i][0].awayGoalsPerTeam[1] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][3].name}`, team2: `${this.groups[i][2].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][1].name}`, team2: `${this.groups[i][0].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                break;
            }
            case 6: {
                for (let i = 0; i < 8; i++) {
                    const matchResult1HomeTeam = this.getRandomNumber(4);
                    const matchResult1AwayTeam = this.getRandomNumber(4);
                    const matchResult2HomeTeam = this.getRandomNumber(4);
                    const matchResult2AwayTeam = this.getRandomNumber(4);

                    if (matchResult1HomeTeam > matchResult1AwayTeam) {
                        this.groups[i][2].points = this.groups[i][2].points + 3;
                        this.groups[i][2].pointsPerTeam[1] = this.groups[i][2].pointsPerTeam[1] + 3;
                    } else {
                        if (matchResult1HomeTeam < matchResult1AwayTeam) {
                            this.groups[i][1].points = this.groups[i][1].points + 3;
                            this.groups[i][1].pointsPerTeam[2] = this.groups[i][1].pointsPerTeam[2] + 3;
                        } else {
                            this.groups[i][2].points = this.groups[i][2].points + 1;
                            this.groups[i][1].points = this.groups[i][1].points + 1;
                        }
                    }

                    if (matchResult2HomeTeam > matchResult2AwayTeam) {
                        this.groups[i][0].points = this.groups[i][0].points + 3;
                        this.groups[i][0].pointsPerTeam[3] = this.groups[i][0].pointsPerTeam[3] + 3;
                    } else {
                        if (matchResult2HomeTeam < matchResult2AwayTeam) {
                            this.groups[i][3].points = this.groups[i][3].points + 3;
                            this.groups[i][3].pointsPerTeam[0] = this.groups[i][3].pointsPerTeam[0] + 3;
                        } else {
                            this.groups[i][0].points = this.groups[i][0].points + 1;
                            this.groups[i][3].points = this.groups[i][3].points + 1;
                        }
                    }

                    this.groups[i][2].goals[0] = this.groups[i][2].goals[0] + matchResult1HomeTeam;
                    this.groups[i][1].goals[0] = this.groups[i][1].goals[0] + matchResult1AwayTeam;
                    this.groups[i][0].goals[0] = this.groups[i][0].goals[0] + matchResult2HomeTeam;
                    this.groups[i][3].goals[0] = this.groups[i][3].goals[0] + matchResult2AwayTeam;

                    this.groups[i][2].goals[1] = this.groups[i][2].goals[1] + matchResult1AwayTeam;
                    this.groups[i][1].goals[1] = this.groups[i][1].goals[1] + matchResult1HomeTeam;
                    this.groups[i][0].goals[1] = this.groups[i][0].goals[1] + matchResult2AwayTeam;
                    this.groups[i][3].goals[1] = this.groups[i][3].goals[1] + matchResult2HomeTeam;

                    this.groups[i][2].goalsDifferencePerTeam[1] = this.groups[i][2].goalsDifferencePerTeam[1] + matchResult1HomeTeam - matchResult1AwayTeam;
                    this.groups[i][1].goalsDifferencePerTeam[2] = this.groups[i][1].goalsDifferencePerTeam[2] + matchResult1AwayTeam - matchResult1HomeTeam;
                    this.groups[i][0].goalsDifferencePerTeam[3] = this.groups[i][0].goalsDifferencePerTeam[3] + matchResult2HomeTeam - matchResult2AwayTeam;
                    this.groups[i][3].goalsDifferencePerTeam[0] = this.groups[i][3].goalsDifferencePerTeam[0] + matchResult2AwayTeam - matchResult2HomeTeam;

                    this.groups[i][1].awayGoalsPerTeam[2] = this.groups[i][1].awayGoalsPerTeam[2] + matchResult1AwayTeam;
                    this.groups[i][3].awayGoalsPerTeam[0] = this.groups[i][3].awayGoalsPerTeam[0] + matchResult2AwayTeam;

                    this.results.push(
                        { team1: `${this.groups[i][2].name}`, team2: `${this.groups[i][0].name}`, score: [matchResult1HomeTeam, matchResult1AwayTeam] },
                        { team1: `${this.groups[i][1].name}`, team2: `${this.groups[i][3].name}`, score: [matchResult2HomeTeam, matchResult2AwayTeam] }
                    );
                }
                this.sortDataPlayoff = [this.groups.map(g => this.sort(g)[0]), this.groups.map(g => this.sort(g)[1])];
                let pot1 = this.groups.map(g => this.sort(g)[0]);
                let pot2 = this.groups.map(g => this.sort(g)[1]);

                for (let j = 0; j < 8; j++) {
                    const team1 = pot1[Math.floor(Math.random() * pot1.length)];
                    pot1 = pot1.filter(a => a.name !== team1.name);

                    const team2 = pot2.filter(a => a.shortCountryName !== team1.shortCountryName)[Math.floor(Math.random() * pot2.filter(a => a.shortCountryName !== team1.shortCountryName).length)];
                    pot2 = pot2.filter(a => a.name !== team2.name);

                    this.roundOf16Teams[0].push(team1);
                    this.roundOf16Teams[1].push(team2);
                }
                break;
            }
            case 7: {
                const a = this.simulatePlayoff(8);
                this.roundOf16 = a.result;
                this.roundOf8Teams = a.teams;
                this.teamsLeft = [...this.roundOf8Teams].sort((x, y) => 0.5 - Math.random());
                this.roundOf8Teams = [...this.teamsLeft];
                break;
            }
            case 8: {
                const a = this.simulatePlayoff(4);
                this.roundOf8 = a.result;
                this.roundOf4Teams = a.teams;
                this.teamsLeft = [...this.roundOf4Teams].sort((x, y) => 0.5 - Math.random());
                this.roundOf4Teams = [...this.teamsLeft];
                break;
            }
            case 9: {
                const a = this.simulatePlayoff(2);
                this.roundOf4 = a.result;
                this.roundOf2Teams = a.teams;
                break;
            }
            case 10: {
                this.roundOf2 = this.simulateFinal();
                break;
            }
        }

        this.day = this.day + 1;
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    getLogo(club) {
        return `logo logo-${club.replace(/\s+/g, '-').toLowerCase()}`;
    }

    simulatePlayoff(stage) {
        const result = [];
        this.next = [];
        let teamsLeft = [...this.teamsLeft];
        for (let i = 0; i < stage; i++) {
            let team1;
            let team2;

            if (stage === 8) {
                team1 = this.roundOf16Teams[0][i];
                team2 = this.roundOf16Teams[1][i];
            } else {
                team1 = teamsLeft[1];
                team2 = teamsLeft[0];
                teamsLeft = teamsLeft.filter(a => a.name !== team1.name && a.name !== team2.name);
            }

            const matchResult1HomeTeam = this.getRandomNumber(4);
            const matchResult1AwayTeam = this.getRandomNumber(4);
            const matchResult2HomeTeam = this.getRandomNumber(4);
            const matchResult2AwayTeam = this.getRandomNumber(4);

            result.push(
                {
                    team1: team2,
                    team2: team1,
                    score: [matchResult1HomeTeam, matchResult1AwayTeam],
                },
                {
                    team1,
                    team2,
                    score: [matchResult2HomeTeam, matchResult2AwayTeam],
                }
            );

            if (matchResult2HomeTeam + matchResult1AwayTeam > matchResult1HomeTeam + matchResult2AwayTeam) {
                this.next.push(team1);
                result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                    {
                        comment: `${team1.name} won
                        ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam} on aggregate`,
                    });
            } else {
                if (matchResult2HomeTeam + matchResult1AwayTeam < matchResult1HomeTeam + matchResult2AwayTeam) {
                    this.next.push(team2);
                    result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                        {
                            comment: `${team2.name} won
                            ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam} on aggregate`,
                        });
                } else {
                    if (matchResult1AwayTeam > matchResult2AwayTeam) {
                        this.next.push(team1);
                        result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                            {
                                comment: `${team1.name} won
                                ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam} on away goals`,
                            });
                    } else {
                        if (matchResult1AwayTeam < matchResult2AwayTeam) {
                            this.next.push(team2);
                            result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                {
                                    comment: `${team2.name} won
                                    ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam} on away goals`,
                                });
                        } else {
                            const extraGoals1 = Math.floor(Math.random() * 2);
                            const extraGoals2 = Math.floor(Math.random() * 2);
                            let penatlyGoals1 = Math.floor(Math.random() * 3 + 2);
                            let penatlyGoals2 = Math.floor(Math.random() * 3 + 2);

                            if (extraGoals1 > extraGoals2) {
                                this.next.push(team1);
                                result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                    {
                                        comment:
                                            `${team1.name} won
                                            ${matchResult2HomeTeam + matchResult1AwayTeam + extraGoals1}:${matchResult1HomeTeam + matchResult2AwayTeam + extraGoals2}
                                            on aggregate in extra time
                                            ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                            (${extraGoals1}:${extraGoals2})`,
                                    });
                            } else {
                                if (extraGoals1 < extraGoals2) {
                                    this.next.push(team2);
                                    result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                        {
                                            comment:
                                                `${team2.name} won
                                                ${matchResult2HomeTeam + matchResult1AwayTeam + extraGoals1}:${matchResult1HomeTeam + matchResult2AwayTeam + extraGoals2}
                                                on aggregate in extra time
                                                ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                (${extraGoals1}:${extraGoals2})`,
                                        });
                                } else {
                                    if (matchResult1AwayTeam + extraGoals1 > matchResult2AwayTeam) {
                                        this.next.push(team1);
                                        result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                            {
                                                comment: `${team1.name} won on away goals in extra time
                                                ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                (${extraGoals1}:${extraGoals2})`,
                                            });
                                    } else {
                                        if (matchResult1AwayTeam + extraGoals1 < matchResult2AwayTeam) {
                                            this.next.push(team2);
                                            result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                                {
                                                    comment:
                                                        `${team2.name} won on away goals in extra time
                                                        ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                        (${extraGoals1}:${extraGoals2})`,
                                                });
                                        } else {
                                            if (penatlyGoals1 > penatlyGoals2) {
                                                this.next.push(team1);
                                                result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                                    {
                                                        comment:
                                                            `${team1.name} won on penalties
                                                            ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                            (${extraGoals1}:${extraGoals2})
                                                            Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                                    });
                                            } else {
                                                if (penatlyGoals1 < penatlyGoals2) {
                                                    this.next.push(team2);
                                                    result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                                        {
                                                            comment:
                                                                `${team2.name} won on penalties
                                                                ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                                (${extraGoals1}:${extraGoals2}) Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                                        });
                                                } else {
                                                    do {
                                                        penatlyGoals1 = penatlyGoals1 + Math.floor(Math.random() * 1);
                                                        penatlyGoals2 = penatlyGoals2 + Math.floor(Math.random() * 1);
                                                    } while (penatlyGoals1 === penatlyGoals2);

                                                    if (penatlyGoals1 > penatlyGoals2) {
                                                        this.next.push(team1);
                                                        result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                                            {
                                                                comment:
                                                                    `${team1.name} won on penalties
                                                                    ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                                    (${extraGoals1}:${extraGoals2}) Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                                            });
                                                    } else {
                                                        this.next.push(team2);
                                                        result[i * 2 + 1] = Object.assign(result[i * 2 + 1],
                                                            {
                                                                comment:
                                                                    `${team2.name} won on penalties
                                                                    ${matchResult2HomeTeam + matchResult1AwayTeam}:${matchResult1HomeTeam + matchResult2AwayTeam}
                                                                    (${extraGoals1}:${extraGoals2}) Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                                            });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.teamsLeft = this.next;

        return { result, teams: this.next };
    }

    simulateFinal() {
        let result = {};

        const team1 = this.teamsLeft[0];
        const team2 = this.teamsLeft[1];

        const matchResult1HomeTeam = this.getRandomNumber(4);
        const matchResult1AwayTeam = this.getRandomNumber(4);

        result = {
            team1,
            team2,
            score: [matchResult1HomeTeam, matchResult1AwayTeam],
        };

        if (matchResult1HomeTeam > matchResult1AwayTeam) {
            this.winner = team1;
        } else {
            this.winner = team2;
        }

        if (matchResult1HomeTeam === matchResult1AwayTeam) {
            const extraGoals1 = Math.floor(Math.random() * 2);
            const extraGoals2 = Math.floor(Math.random() * 2);

            let penatlyGoals1 = Math.floor(Math.random() * 3 + 2);
            let penatlyGoals2 = Math.floor(Math.random() * 3 + 2);

            if (extraGoals1 > extraGoals2) {
                this.winner = team1;
                result = Object.assign(result,
                    {
                        comment: `${team1.name} won ${matchResult1HomeTeam + extraGoals1}:${matchResult1AwayTeam + extraGoals2}
                                  in extra time (${extraGoals1}:${extraGoals2})`,
                    });
            } else {
                if (extraGoals1 < extraGoals2) {
                    this.winner = team2;
                    result = Object.assign(result,
                        {
                            comment: `${team2.name} won ${matchResult1HomeTeam + extraGoals1}:${matchResult1AwayTeam + extraGoals2}
                            in extra time (${extraGoals1}:${extraGoals2})`,
                        });
                } else {
                    if (penatlyGoals1 > penatlyGoals2) {
                        this.winner = team1;
                        result = Object.assign(result,
                            {
                                comment: `${team1.name} won ${matchResult1HomeTeam + extraGoals1}:${matchResult1AwayTeam + extraGoals2}
                                          on penalties (${extraGoals1}:${extraGoals2}) Pen. ${penatlyGoals1}: ${penatlyGoals2}`,
                            });
                    } else {
                        if (penatlyGoals1 < penatlyGoals2) {
                            this.winner = team2;
                            result = Object.assign(result,
                                {
                                    comment: `${team2.name} won ${matchResult1HomeTeam + extraGoals1}:${matchResult1AwayTeam + extraGoals2}
                                          on penalties (${extraGoals1}:${extraGoals2}) Pen. ${penatlyGoals1}: ${penatlyGoals2}`,
                                });
                        } else {
                            do {
                                penatlyGoals1 = penatlyGoals1 + Math.floor(Math.random() * 1);
                                penatlyGoals2 = penatlyGoals2 + Math.floor(Math.random() * 1);
                            } while (penatlyGoals1 === penatlyGoals2);

                            if (penatlyGoals1 > penatlyGoals2) {
                                this.winner = team1;
                                result = Object.assign(result,
                                    {
                                        comment:
                                            `${team1.name} won on penalties
                                            ${matchResult1HomeTeam}:${matchResult1AwayTeam}
                                            (${extraGoals1}:${extraGoals2}) Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                    });
                            } else {
                                this.winner = team2;
                                result = Object.assign(result,
                                    {
                                        comment:
                                            `${team2.name} won on penalties
                                            ${matchResult1HomeTeam}:${matchResult1AwayTeam}
                                            (${extraGoals1}:${extraGoals2}) Pen. (${penatlyGoals1}:${penatlyGoals2})`,
                                    });
                            }
                        }
                    }
                }
            }
        }

        return result;
    }
}
