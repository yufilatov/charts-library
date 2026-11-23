import { CommonModule, KeyValuePipe } from '@angular/common';
import { DATA } from './data';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import * as _ from 'lodash';

type TeamInfo = {
    country: string;
    id: number;
    name: string;
    pot: number;
    shortCountryName: string;
    shortName: string;
    logo?: string;
}

type Team = {
    home: TeamInfo[];
    away: TeamInfo[];
    team: TeamInfo;
    fixtures: any;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    played: number;
    for: number;
    against: number;
}

@Component({
    selector: 'app-example-champions-league-2024',
    templateUrl: './example-champions-league-2024.component.html',
    styleUrls: ['./example-champions-league-2024.component.scss', '../../styles/epl-emblems.scss', '../../styles/champions-league-logos.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [KeyValuePipe, CommonModule]
})
export class ExampleChampionsLeague2024Component implements OnDestroy {
    data = DATA;
    pots = { 1: [], 2: [], 3: [], 4: [] };

    isDraw = false;
    drawing = false;
    played = false;
    activeTeamId: number = null;
    private drawTimers: ReturnType<typeof setTimeout>[] = [];

    table: Map<number, Team> = null;

    allMatches = [];
    matchdays = [];
    copy;
    knockout;

    cdr = inject(ChangeDetectorRef);

    getLogo(club) {
        return `logo logo-${club.replace(/\s+/g, '-').toLowerCase()}`;
    }

    sortData(index: string) {
        return this.data.filter(d => d.pot === Number(index));
    }

    ngOnDestroy(): void {
        this.clearDrawTimers();
    }

    draw(): void {
        const full = this.process();
        if (!full) {
            return;
        }

        this.clearDrawTimers();
        const display = new Map<number, Team>();
        for (const [id, row] of full) {
            display.set(id, { team: row.team, home: [], away: [] } as Team);
        }

        const queued = new Set<string>();
        const steps = [];
        for (const [id, row] of full) {
            const queue = (side: 'home' | 'away', index: number, opponent: TeamInfo) => {
                const key = [id, opponent.id].sort((a, b) => a - b).join('-');
                if (queued.has(key)) {
                    return;
                }
                queued.add(key);
                steps.push({
                    teamId: id,
                    side,
                    index,
                    opponent,
                    mirrorId: opponent.id,
                    mirrorSide: side === 'home' ? 'away' : 'home',
                    mirrorIndex: row.team.pot - 1,
                    mirrorTeam: row.team,
                });
            };

            row.home.forEach((opponent, index) => queue('home', index, opponent));
            row.away.forEach((opponent, index) => queue('away', index, opponent));
        }

        this.isDraw = true;
        this.drawing = true;
        this.played = false;
        this.knockout = null;
        this.copy = null;
        this.table = display;
        this.cdr.detectChanges();

        const delay = 80;
        steps.forEach((step, index) => {
            const timer = setTimeout(() => {
                const row = this.table.get(step.teamId);
                const mirror = this.table.get(step.mirrorId);
                row[step.side][step.index] = step.opponent;
                mirror[step.mirrorSide][step.mirrorIndex] = step.mirrorTeam;
                this.activeTeamId = step.teamId;
                this.cdr.detectChanges();
                document.getElementById(`draw-team-${step.teamId}`)?.scrollIntoView({ block: 'nearest' });

                if (index === steps.length - 1) {
                    const sorted = [...this.table.entries()].sort((a, b) => a[1].team.name.localeCompare(b[1].team.name));
                    this.copy = new Map(sorted);
                    this.drawing = false;
                    this.activeTeamId = null;
                    this.cdr.detectChanges();
                }
            }, index * delay);
            this.drawTimers.push(timer);
        });
    }

    play(): void {
        this.allMatches = [];

        for (const [, values] of this.table) {
            const currentTeam = values['team'];
            const fixtures = [];

            values.home.forEach(opponent => {
                const newOpponent = this.table.get(opponent.id);
                const match = { teams: [currentTeam, newOpponent.team] };
                fixtures.push(match);
                this.allMatches.push(match);
            });

            values.away.forEach(opponent => {
                const newOpponent = this.table.get(opponent.id);
                const match = { teams: [newOpponent.team, currentTeam] };
                fixtures.push(match);
                this.allMatches.push(match);
            });
            values['fixtures'] = fixtures;
        }

        this.allMatches.forEach(match => {
            const team1 = match.teams[0];
            const team2 = match.teams[1];
            if (!match['fixture']) {
                match['fixture'] = `${team1.name} - ${team2.name}`;
            }
        });

        const fixtures = this.allMatches.filter((obj, index, self) =>
            index === self.findIndex(item => item.fixture === obj.fixture)
        );

        fixtures.forEach(fixture => {
            const team1 = this.table.get(fixture.teams[0].id);
            const team2 = this.table.get(fixture.teams[1].id);
            const team1Score = this.getRandomNumber(4);
            const team2Score = this.getRandomNumber(4);

            const match = `${team1.team.name} - ${team2.team.name}`;
            const scoreline = `${team1.team.name} - ${team2.team.name} ${team1Score}:${team2Score}`;

            fixture.homeScore = team1Score;
            fixture.awayScore = team2Score;
            team1.fixtures.find(f => match === f.fixture).fixture = scoreline;
            team2.fixtures.find(f => match === f.fixture).fixture = scoreline;

            if (team1Score > team2Score) {
                team1.points = (team1.points || 0) + 3;
                team1.won = (team1.won || 0) + 1;
                team2.lost = (team2.lost || 0) + 1;
            }

            if (team1Score < team2Score) {
                team2.points = (team2.points || 0) + 3;
                team2.won = (team2.won || 0) + 1;
                team1.lost = (team1.lost || 0) + 1;
            }

            if (team1Score === team2Score) {
                team1.points = (team1.points || 0) + 1;
                team2.points = (team2.points || 0) + 1;
                team2.drawn = (team2.drawn || 0) + 1;
                team1.drawn = (team1.drawn || 0) + 1;
            }

            team1.played = (team1.played || 0) + 1;
            team2.played = (team2.played || 0) + 1;

            team1.for = (team1.for || 0) + team1Score;
            team2.for = (team2.for || 0) + team2Score;

            team1.against = (team1.against || 0) + team2Score;
            team2.against = (team2.against || 0) + team1Score;
        });

        const matchdays = this.buildMatchdays(fixtures);
        this.matchdays = matchdays.map(day =>
            _.cloneDeep(day).sort((a, b) => a.teams[0].name.localeCompare(b.teams[0].name))
        );
        this.allMatches = this.matchdays.flat();
        this.copy = _.cloneDeep(this.sortTable(this.table));
        this.played = true;
        this.cdr.detectChanges();
    }

    simulateKnockout(): void {
        const ranked = [...this.copy.values()].map(row => row.team);
        const playoffWinners = [];
        const playoff = [];

        for (let i = 0; i < 8; i++) {
            const tie = this.playTie(ranked[8 + i], ranked[23 - i]);
            playoff.push(tie);
            playoffWinners.push(tie.winner);
        }

        const roundOf16Pairs = [
            [ranked[0], playoffWinners[7]],
            [ranked[7], playoffWinners[0]],
            [ranked[3], playoffWinners[4]],
            [ranked[4], playoffWinners[3]],
            [ranked[1], playoffWinners[6]],
            [ranked[6], playoffWinners[1]],
            [ranked[2], playoffWinners[5]],
            [ranked[5], playoffWinners[2]],
        ];
        const roundOf16 = roundOf16Pairs.map(([seed, opponent]) => this.playTie(seed, opponent));

        const quarterPairs = [[0, 1], [2, 3], [4, 5], [6, 7]]
            .map(([left, right]) => this.pairByRank(roundOf16[left].winner, roundOf16[right].winner, ranked));
        const quarterFinals = quarterPairs.map(([home, away]) => this.playTie(home, away));

        const semiPairs = [[0, 1], [2, 3]]
            .map(([left, right]) => this.pairByRank(quarterFinals[left].winner, quarterFinals[right].winner, ranked));
        const semiFinals = semiPairs.map(([home, away]) => this.playTie(home, away));

        const [finalHome, finalAway] = this.pairByRank(semiFinals[0].winner, semiFinals[1].winner, ranked);
        const final = this.playFinal(finalHome, finalAway);

        this.knockout = { playoff, roundOf16, quarterFinals, semiFinals, final, winner: final.winner };
        this.cdr.detectChanges();
    }

    getRandomNumber(max): number {
        return Math.floor(Math.random() * max);
    }

    private pairByRank(teamA, teamB, ranked) {
        const rankA = ranked.findIndex(team => team.id === teamA.id);
        const rankB = ranked.findIndex(team => team.id === teamB.id);
        return rankA < rankB ? [teamA, teamB] : [teamB, teamA];
    }

    private playTie(seed, opponent) {
        const firstLegHome = this.getRandomNumber(4);
        const firstLegAway = this.getRandomNumber(4);
        const secondLegHome = this.getRandomNumber(4);
        const secondLegAway = this.getRandomNumber(4);
        const matches = [
            { team1: opponent, team2: seed, score: [firstLegHome, firstLegAway] },
            { team1: seed, team2: opponent, score: [secondLegHome, secondLegAway] },
        ];

        let seedGoals = secondLegHome + firstLegAway;
        let opponentGoals = firstLegHome + secondLegAway;
        let seedAway = firstLegAway;
        let opponentAway = secondLegAway;
        let comment = '';
        let winner = null;

        if (seedGoals !== opponentGoals) {
            winner = seedGoals > opponentGoals ? seed : opponent;
            comment = `${winner.name} won ${Math.max(seedGoals, opponentGoals)}:${Math.min(seedGoals, opponentGoals)} on aggregate`;
        } else if (seedAway !== opponentAway) {
            winner = seedAway > opponentAway ? seed : opponent;
            comment = `${winner.name} won ${seedGoals}:${opponentGoals} on away goals`;
        } else {
            const seedExtra = Math.floor(Math.random() * 2);
            const opponentExtra = Math.floor(Math.random() * 2);
            seedGoals += seedExtra;
            opponentGoals += opponentExtra;
            seedAway += seedExtra;

            if (seedGoals !== opponentGoals) {
                winner = seedGoals > opponentGoals ? seed : opponent;
                comment = `${winner.name} won ${Math.max(seedGoals, opponentGoals)}:${Math.min(seedGoals, opponentGoals)} after extra time (${seedExtra}:${opponentExtra})`;
            } else if (seedAway !== opponentAway) {
                winner = seedAway > opponentAway ? seed : opponent;
                comment = `${winner.name} won on away goals after extra time ${seedGoals - seedExtra}:${opponentGoals - opponentExtra} (${seedExtra}:${opponentExtra})`;
            } else {
                let seedPenalties = Math.floor(Math.random() * 3 + 2);
                let opponentPenalties = Math.floor(Math.random() * 3 + 2);
                while (seedPenalties === opponentPenalties) {
                    if (Math.random() < 0.5) {
                        seedPenalties++;
                    } else {
                        opponentPenalties++;
                    }
                }
                winner = seedPenalties > opponentPenalties ? seed : opponent;
                comment = `${winner.name} won on penalties ${seedGoals - seedExtra}:${opponentGoals - opponentExtra} (${seedExtra}:${opponentExtra}) Pen. ${seedPenalties}:${opponentPenalties}`;
            }
        }

        matches[1]['winner'] = winner;
        matches[1]['comment'] = comment;
        return { matches, winner };
    }

    private playFinal(team1, team2) {
        const homeGoals = this.getRandomNumber(4);
        const awayGoals = this.getRandomNumber(4);
        const match = { team1, team2, score: [homeGoals, awayGoals], winner: null, comment: '' };

        if (homeGoals !== awayGoals) {
            match.winner = homeGoals > awayGoals ? team1 : team2;
        } else {
            const extra1 = Math.floor(Math.random() * 2);
            const extra2 = Math.floor(Math.random() * 2);
            if (extra1 !== extra2) {
                match.winner = extra1 > extra2 ? team1 : team2;
                match.comment = `${match.winner.name} won ${homeGoals + extra1}:${awayGoals + extra2} after extra time (${extra1}:${extra2})`;
            } else {
                let penalties1 = Math.floor(Math.random() * 3 + 2);
                let penalties2 = Math.floor(Math.random() * 3 + 2);
                while (penalties1 === penalties2) {
                    if (Math.random() < 0.5) {
                        penalties1++;
                    } else {
                        penalties2++;
                    }
                }
                match.winner = penalties1 > penalties2 ? team1 : team2;
                match.comment = `${match.winner.name} won on penalties ${homeGoals}:${awayGoals} (${extra1}:${extra2}) Pen. ${penalties1}:${penalties2}`;
            }
        }

        return { matches: [match], winner: match.winner };
    }

    process() {
        const maxAttempts = 500;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const tableSet = this.attemptDraw();
            if (tableSet) {
                return tableSet;
            }
        }

        return null;
    }

    returnZero() {
        return 0;
    }

    private sortTable(table: Map<number, Team>): Map<number, Team> {
        const entries = [...table.entries()].sort((a, b) => {
            const pointsDiff = (b[1].points || 0) - (a[1].points || 0);
            if (pointsDiff !== 0) {
                return pointsDiff;
            }

            const goalDifferenceA = (a[1].for || 0) - (a[1].against || 0);
            const goalDifferenceB = (b[1].for || 0) - (b[1].against || 0);
            if (goalDifferenceB !== goalDifferenceA) {
                return goalDifferenceB - goalDifferenceA;
            }

            return (b[1].for || 0) - (a[1].for || 0);
        });

        return new Map(entries);
    }

    private attemptDraw(): Map<number, Team> | null {
        const data = _.cloneDeep(this.data);
        this.pots = { 1: [], 2: [], 3: [], 4: [] };
        const tableSet = new Map<number, Team>();

        data.forEach(team => {
            this.pots[team.pot].push(team);
            tableSet.set(team.id, { team, home: [], away: [] } as Team);
        });

        for (const [teamId, values] of tableSet) {
            const currentTeamPot = values.team.pot - 1;
            const currentTeam = values.team;

            for (const [pot, teams] of Object.entries(this.pots)) {
                const index = Number(pot) - 1;
                let opponentHome = values.home[index];
                let opponentAway = values.away[index];

                if (!opponentHome) {
                    const opponents = this.shuffle(teams.filter(t => t.id !== teamId && t.shortCountryName !== currentTeam.shortCountryName));
                    opponentHome = opponents.find(o => tableSet.get(o.id).away[currentTeamPot] == null);
                    if (!opponentHome) {
                        return null;
                    }

                    values.home[index] = opponentHome;
                    tableSet.get(opponentHome.id).away[currentTeamPot] = currentTeam;
                }

                if (!opponentAway) {
                    const opponents = this.shuffle(teams.filter(t => t.id !== teamId && t.id !== opponentHome.id && t.shortCountryName !== currentTeam.shortCountryName));
                    opponentAway = opponents.find(o => tableSet.get(o.id).home[currentTeamPot] == null);
                    if (!opponentAway) {
                        return null;
                    }

                    values.away[index] = opponentAway;
                    tableSet.get(opponentAway.id).home[currentTeamPot] = currentTeam;
                }
            }
        }

        return tableSet;
    }

    private buildMatchdays(fixtures) {
        for (let attempt = 0; attempt < 40; attempt++) {
            const days = this.scheduleMatchdays(this.shuffle(fixtures));
            if (days) {
                return days;
            }
        }

        return [fixtures];
    }

    private scheduleMatchdays(fixtures) {
        const teamIds = [...new Set(fixtures.flatMap(fixture => [fixture.teams[0].id, fixture.teams[1].id]))] as number[];
        let remaining = fixtures.map((fixture, index) => ({ fixture, index }));
        const days = [];

        for (let day = 0; day < 8; day++) {
            const matching = this.findMatchday(remaining, teamIds);
            if (!matching) {
                return null;
            }

            days.push(matching.map(edge => edge.fixture));
            const used = new Set(matching.map(edge => edge.index));
            remaining = remaining.filter(edge => !used.has(edge.index));
        }

        return days;
    }

    private findMatchday(edges, teamIds: number[]) {
        const opponents = new Map<number, any[]>();
        teamIds.forEach(id => opponents.set(id, []));
        edges.forEach(edge => {
            opponents.get(edge.fixture.teams[0].id).push(edge);
            opponents.get(edge.fixture.teams[1].id).push(edge);
        });

        const matched = new Set<number>();
        const chosen = [];
        let visits = 0;

        const otherId = (edge, teamId: number) =>
            edge.fixture.teams[0].id === teamId ? edge.fixture.teams[1].id : edge.fixture.teams[0].id;

        const available = (teamId: number) =>
            opponents.get(teamId).filter(edge => !matched.has(otherId(edge, teamId)));

        const search = (): boolean => {
            if (matched.size === teamIds.length) {
                return true;
            }
            if (++visits > 20000) {
                return false;
            }

            let teamId = teamIds[0];
            let fewest = Infinity;
            for (const id of teamIds) {
                if (matched.has(id)) {
                    continue;
                }
                const count = available(id).length;
                if (count < fewest) {
                    fewest = count;
                    teamId = id;
                    if (count === 0) {
                        break;
                    }
                }
            }

            if (fewest === 0) {
                return false;
            }

            for (const edge of available(teamId)) {
                const homeId = edge.fixture.teams[0].id;
                const awayId = edge.fixture.teams[1].id;
                matched.add(homeId);
                matched.add(awayId);
                chosen.push(edge);
                if (search()) {
                    return true;
                }
                chosen.pop();
                matched.delete(homeId);
                matched.delete(awayId);
            }

            return false;
        };

        return search() ? chosen : null;
    }

    private clearDrawTimers(): void {
        this.drawTimers.forEach(timer => clearTimeout(timer));
        this.drawTimers = [];
    }

    private shuffle(array) {
        return _.cloneDeep(array)
            .map((a) => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map((a) => a[1]);
    }
}
