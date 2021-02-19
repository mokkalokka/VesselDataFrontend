
import {ref } from "vue";
import { useFetch } from "@/composables/useFetch"

interface SensorTypes{
    [key: string]: number[] | null[];
  }

interface Types{
    [key: string]: any | any[];
}



export function useSensorData() {
    const sensors = ref([] as Types) 
    const sensorNames = ref([] as Types)
 
    const {response, error, fetching, fetchData} = useFetch('http://localhost:3000/sensors');
    

    function setSensorNames(){
        sensorNames.value = response.value.map(e => Object.keys(e).values)  /*Object.keys(response.value)   .filter(key => response.value[key][0] != null) */
        /* sensorNames.value = sensorNames.value.filter(e => e[0] != null) */
    }
    

    function setSensors() {
        sensors.value  = response.value /* .filter(sensor => sensorNames.value.contains(Object.keys(sensor))) */
    }
    fetchData().then(() =>{
        setSensorNames(),
        setSensors()
    })
    
    

    return{
        sensors,
        sensorNames, 
        error, 
        fetching,
        fetchData
        
    }
}

