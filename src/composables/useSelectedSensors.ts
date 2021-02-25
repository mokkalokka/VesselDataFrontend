import { ref } from 'vue'

interface SensorName {
    id: number;
    filterkey: string;
    sensorName: string;
    description: string;
    startTime: Date;
    endTime: Date;
}

const selectedSensors = ref([] as SensorName[])
export function useSelectedSensors(){
    
    return selectedSensors;
}