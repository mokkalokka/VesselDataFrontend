import { Sensor } from "./sensorInterface";

export interface Group {

    id: number;
    sensors: Sensor[];
    groupDate: boolean;
    fromDate: String;
    fromTime: String;
    toDate: String;
    toTime: String;
    fromDateTime: Date,
    toDateTime: Date,
}