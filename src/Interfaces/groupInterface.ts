import { Sensor } from "./sensorInterface";

export interface Group {

    id: number;
    sensors: Sensor[];
    groupDate: boolean;
    fromDate: Date;
    toDate: Date;
}