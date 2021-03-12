export interface Sensor {
    id: number;
    filterkey: string;
    sensorName: string;
    description: string;
    startTime: Date;
    endTime: Date;
    group: number;
    grahpsToCompare: number[];
    graphType: string;
}