import { ref } from 'vue'
import { Sensor } from "@/composables/sensorInterface"

const selectedSensors = ref([] as Sensor[])
export function useSelectedSensors(){
    
    return selectedSensors;
}