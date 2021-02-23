import { ref } from 'vue'
const selectedSensors = ref([] as [])
export function useSelectedSensors(){
    
    return selectedSensors;
}