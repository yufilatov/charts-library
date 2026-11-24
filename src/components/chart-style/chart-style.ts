export type ChartStyleKey =
    | 'animation'
    | 'arc'
    | 'cell'
    | 'circle'
    | 'pie'
    | 'bar'
    | 'label'
    | 'line'
    | 'link'
    | 'matrix'
    | 'node'
    | 'rect'
    | 'zoom';

export interface IChartStyle {
    key?: ChartStyleKey;
    changeSet?: Set<string>;
}

export interface IChartAnimationStyle extends IChartStyle {
    delay?: number;
    duration?: number;
    format?: string;
}

export interface IChartCellStyle extends IChartStyle {
    fill?: string;
}

export interface IChartCircleStyle extends IChartStyle {
    fill?: string;
    radius?: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface IChartArcStyle extends IChartStyle {
    fill?: string;
    fillHover?: string;
    innerRadius?: number;
    outerRadius?: number;
    opacity?: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface IChartBarStyle extends IChartStyle {
    fill?: string;
    background?: string;
    size?: number;
    offsetLeft?: number;
    offsetRight?: number;
    paddingLeft?: number;
    paddgingRight?: number;
}

export interface IChartLabelStyle extends IChartStyle {
    color?: string;
    colorHover?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    backgroundColor?: string;
    text?: string;
    letterSpacing?: number;
}

export interface IChartLineStyle extends IChartStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
}

export interface IChartLinkStyle extends IChartStyle {
    startColor?: string;
    stopColor?: string;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
}

export interface IChartMatrixStyle extends IChartStyle {
    color: string;
    opacity: string;
}

export interface IChartNodeStyle extends IChartStyle {
    fill?: string;
    fillLast?: string;
    padding?: number;
    radius?: number;
    radiusOnHover?: number;
    size?: number;
    startColor?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface IChartPieStyle extends IChartStyle {
    innerRadius?: number;
    outerRadius?: number;
}

export interface IChartRectStyle extends IChartStyle {
    fill?: string;
}

export interface IChartZoomStyle extends IChartStyle {
    duration?: number;
    enabled?: boolean;
}

export abstract class ChartStyle {
    static get animation(): IChartAnimationStyle {
        return {
            key: 'animation',
            delay: 1000,
            duration: 1000,
            format: ',d',
        };
    }

    static get cell(): IChartCellStyle {
        return {
            key: 'cell',
            fill: '#fff',
        };
    }

    static get circle(): IChartCircleStyle {
        return {
            key: 'circle',
            fill: '#000',
            radius: 5,
            stroke: '#000',
            strokeWidth: 1,
        };
    }

    static get arc(): IChartArcStyle {
        return {
            key: 'arc',
            fill: '#dfe1e6',
            innerRadius: 50,
            outerRadius: 100,
            stroke: '#fff',
            strokeWidth: 3,
            opacity: 1,
        };
    }

    static get bar(): IChartBarStyle {
        return {
            key: 'bar',
            background: 'transparent',
            fill: '#dfe1e6',
            size: 15,
            offsetLeft: 0,
            offsetRight: 0,
            paddingLeft: 5,
            paddgingRight: 5,
        };
    }

    static get label(): IChartLabelStyle {
        return {
            key: 'label',
            color: '#000',
            colorHover: '#d62020',
            fontFamily: '"Source Sans 3 Variable", "Source Sans 3", sans-serif',
            fontSize: 10,
            fontWeight: '400',
            backgroundColor: 'transparent',
            text: '',
        };
    }

    static get line(): IChartLineStyle {
        return {
            key: 'line',
            fill: 'steelblue',
            stroke: '#000',
            strokeWidth: 1,
            strokeDasharray: '',
        };
    }

    static get link(): IChartLinkStyle {
        return {
            key: 'link',
            startColor: '#fff',
            stopColor: '#000',
            stroke: '#555',
            strokeOpacity: 0.4,
            strokeWidth: 1.5,
        };
    }

    static get matrix(): IChartMatrixStyle {
        return {
            key: 'matrix',
            color: 'default',
            opacity: 'default',
        };
    }

    static get node(): IChartNodeStyle {
        return {
            key: 'node',
            fill: '#000',
            fillLast: 'red',
            padding: 1,
            radius: 25,
            radiusOnHover: 5,
            size: 300,
            startColor: '#6de9eb',
            stroke: 'black',
            strokeWidth: 1,
        };
    }

    static get pie(): IChartPieStyle {
        return {
            key: 'pie',
            innerRadius: 10,
            outerRadius: 100,
        };
    }

    static get rect(): IChartRectStyle {
        return {
            key: 'rect',
            fill: '#fff',
        };
    }

    static get zoom(): IChartZoomStyle {
        return {
            key: 'zoom',
            duration: 1500,
            enabled: true,
        };
    }

}



