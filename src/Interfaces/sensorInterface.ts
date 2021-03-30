export interface Sensor {
    id: number;
    filterkey: string;
    sensorName: string;
    description: string;
    fromDateTime: Date;
    toDateTime: Date;
    group: number;
    sensorsToCompare: number[];
    graphType: string;
    fromDate: String;
    fromTime: String;
    toDate: String;
    toTime: String;
}