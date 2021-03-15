import { ref } from 'vue'
import { Sensor } from "@/Interfaces/sensorInterface"

const selectedSensors = ref([] as Sensor[])
export function useSelectedSensors() {

    return selectedSensors;
}

export function resetSelectedSensors() {
    selectedSensors.value = [];
}