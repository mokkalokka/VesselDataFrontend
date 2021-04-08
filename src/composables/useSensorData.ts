
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"
import { Sensor } from "@/Interfaces/sensorInterface"

const sensorNames = ref([] as Sensor[])
const position = ref([])



export function useSensorData() {
    const { response, error, fetching, fetchData } = useFetch('http://localhost:3000/sensors');


    function setSensorNames() {
        /* TODO: filter null values */
        const fromDateTime = new Date(response.value[0].time[0])
        const toDateTime = new Date(response.value[0].time[3599])


        sensorNames.value = response.value.map((e: Sensor, index: number) => {
            const namefields = Object.keys(e)[0].split(".");
            return {
                id: index,
                filterkey: Object.keys(e)[0],
                sensorName: (namefields.length > 1 ? namefields[namefields.length - 2] + " " + namefields[namefields.length - 1] : namefields[0]),
                description: namefields[0],
                fromDateTime: fromDateTime,
                toDateTime: toDateTime,
                group: 1,
                sensorsToCompare: [],
                graphType: "Linje",
                fromDate: fromDateTime.toISOString().slice(0, 10),
                fromTime: fromDateTime.toLocaleTimeString("en-GB"),
                toDate: toDateTime.toISOString().slice(0, 10),
                toTime: toDateTime.toLocaleTimeString("en-GB"),
            }
        }) as Sensor[]
        sensorNames.value = sensorNames.value.filter((sensor: any, index: number) => response.value[index][sensor.filterkey][0] != (null))
    }

    function getSensorDataById(sensorIds: number[], pointsPerMinute: number) {
        //Adds time 
        sensorIds.unshift(0)

        // Extract the sensors from the response
        let sensors = sensorIds.map(id => Object.values(response.value[id])[0]) as any[][]

        const decimation = (sensors[0].length / 60) / pointsPerMinute

        // Parse dates
        sensors[0] = sensors[0].map(t => new Date(t))

        // Modulus filter
        sensors = sensors.map(e => e.filter((_, index) => index % decimation == 0))

        return sensors
    }

    function getPosition(fromDateTime, toDateTime) {
        const lat = response.value[81]['Nav_Pos.lat'] as number[]
        const lon = response.value[82]['Nav_Pos.lon'] as number[]
        const time = response.value[0]['time'] as number[]
        const timeIndexes = []
        const pos = ref([])
        time.map((e, index) => {
            const date = new Date(e).toString()
            if ((date == fromDateTime.toString()) || (date == toDateTime.toString())) {
                timeIndexes.push(index)
            }
        })

        lat.map((_, index) => {
            if (index >= timeIndexes[0] && index <= timeIndexes[1]) {
                pos.value.push([lat[index], lon[index], time[index]])
            }
        })

        /* console.log(position.value.length) */
        return pos

    }


    function initialize() {
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
        initialize,
        getPosition,
        position,
        response
    }
}

