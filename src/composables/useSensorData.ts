
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"

interface Types {
    [key: string]: any | any[];
}

export function useSensorData() {
    /* const sensors = ref([] as Types) */
    const sensorNames = ref([] as Types)
    const data = ref([])
    /* const selectedSensors = ref([]) */
    const { response, error, fetching, fetchData } = useFetch('http://localhost:3000/sensors');


    function setSensorNames() {
        /* TODO: filter null values */
        const startTime = new Date(response.value[0]["time"][0])
        const endTime =   new Date(response.value[0]["time"][3599])


        sensorNames.value = response.value.map((e: Types, index: number) => {
            return { id: index, 'sensorName': Object.keys(e)[0], startTime: startTime, endTime: endTime}
        })
        sensorNames.value = sensorNames.value.filter((sensor: any, index: number) => response.value[index][sensor.sensorName][0] != (null))}

    function getSensorDataById(sensorIds: number[]) {
        sensorIds.unshift(0) //Adds time   
        return sensorIds.map(id => Object.values(response.value[id])[0])
    }

    function initialize(){
        fetchData().then(() => {
            setSensorNames()

        })
    }

    return {
        getSensorDataById,
        sensorNames,
        error,
        fetching,
        fetchData,
        setSensorNames,
        initialize
    }
}

