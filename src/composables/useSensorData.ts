
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"
import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles";

interface SensorName {
    id: number;
    filterkey: string;
    sensorName: string;
    description: string;
    startTime: Date;
    endTime: Date;
}


const sensorNames = ref([] as SensorName[])
const data = ref([])
const position = ref([] as any)

export function useSensorData() {
    /* const sensors = ref([] as Types) */
    
    
    /* const selectedSensors = ref([]) */
    const { response, error, fetching, fetchData } = useFetch('http://localhost:3000/sensors');


    function setSensorNames() {
        /* TODO: filter null values */
        const startTime = new Date(response.value[0]["time"][0])
        const endTime = new Date(response.value[0]["time"][3599])
        

        sensorNames.value = response.value.map((e: SensorName, index: number) => {
            const namefields = Object.keys(e)[0].split(".");
            return { 
                id: index, 
                filterkey: Object.keys(e)[0],
                sensorName:  (namefields.length > 1 ? namefields[namefields.length - 2] + " " + namefields[namefields.length - 1] : namefields[0]),
                description: namefields[0], 
                startTime: startTime, 
                endTime: endTime } 
        } ) as SensorName[]
        sensorNames.value = sensorNames.value.filter((sensor: any, index: number) => response.value[index][sensor.filterkey][0] != (null))
    }

    function getSensorDataById(sensorIds: number[]) {
        sensorIds.unshift(0) //Adds time   
        return sensorIds.map(id => Object.values(response.value[id])[0])
    }

    function setPosition() {
        const lat = response.value[81]['Nav_Pos.lat'] as number[]
        const lon = response.value[82]['Nav_Pos.lon'] as number[]

        position.value = lat.map((_ , index) =>{
            /* return {lat: lat[index], lng: lon[index]} */
            return [lat[index], lon[index]]
        })
        
    }


    function initialize(){
        fetchData().then(() => {
            setSensorNames()
            data.value = response.value
            setPosition()

        })
    }

    return {
        getSensorDataById,
        sensorNames,
        error,
        fetching,
        fetchData,
        setSensorNames,
        initialize,
        setPosition,
        position
    }
}

