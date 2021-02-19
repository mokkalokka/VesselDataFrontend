
import {ref } from "vue";
import { useFetch } from "@/composables/useFetch"

interface Types{
    [key: string]: any | any[];
}

export function useSensorData() {
    const sensors = ref([] as Types) 
    const sensorNames = ref([] as Types)
 
    const {response, error, fetching, fetchData} = useFetch('http://localhost:3000/sensors');
    

    function setSensorNames(){
        /* TODO: filter null values */
        sensorNames.value = response.value.map((e: Types, index: number) => {
           return  {id: index, 'sensorName': Object.keys(e)[0]}
        } )
    }
    
    function setSensors() {
        sensors.value = response.value
        /* sensors.value = response.value.map((e: Types, index: number) => {
            return  {id: index, 'sensorName': Object.keys(e)[0], data: [response.value[index]['time']]}
         } ) */
    
    }

 /*    function getSelectedSensors(selectedSensors:  string[]) {
        return sensorNames.value.map((name, index) => selectedSensors.includes(name) ? index : null) 
    } */




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

