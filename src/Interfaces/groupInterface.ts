import { Sensor } from "./sensorInterface";

export interface Group {
    id: number;
    sensors: Sensor[];
    groupDate: boolean;
    fromDate: string;
    fromTime: string;
    toDate: string;
    toTime: string;
    fromDateTime: Date;
    toDateTime: Date;
    zoomedFromDateTime?: Date;
    zoomedToDateTime?: Date;
    hoverIndex?: number;
}