
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"
import { Sensor } from "@/Interfaces/sensorInterface"

const sensors = ref([] as Sensor[])
const position = ref([])
const time = ref([])
const names = ref([])


/**
 * Function for handeling API calls for sensor data and structuring sensor data
 * @return getSensorDataById, sensors, initialize, getPosition, position,
 */
export function useSensorData() {

    /**
     * Goes trough the response from /names and creates a list of sensors with metadata
     */
    function setSensors() {
        const fromDateTime = new Date(time.value[0])
        const toDateTime = new Date(time.value[time.value.length - 1])

        sensors.value = names.value.map((e: string, index: number) => {

            const namefields = e.split(".");
            return {
                id: index,
                filterkey: e,
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
    }

    /**
     * 
     * @param {number[]} sensorIds - list of sensorId's to be fetched 
     * @returns data.value - a bundled promise array with sensor data
     */
    async function getSensorDataById(sensorIds: number[]) {
        console.log('getting mock sensor data');
        const today = new Date()

        return Promise.all([
            Promise.resolve(
                [new Date(today.getTime() + 1000)]),
            Promise.resolve([1]),
            Promise.resolve([2])])

    }

    /**
     * Fetch all positions for the current vessel
     * @returns data.value - a bundled promise array with position data and time 
     */
    async function getPosition() {
        console.log('getting mock position');

        const today = new Date()

        return Promise.all([
            Promise.resolve([61, 62, 63]),
            Promise.resolve([2, 3, 4]),
            Promise.resolve([new Date(today.getTime() + 1000), new Date(today.getTime() + 2000), new Date(today.getTime() + 3000)])])
    }


    /**
     * Fetches all the times and sensor names.  Initializes sensors variabel.
     */
    function initialize() {
        const { fetchData: fetchTime } = useFetch('http://localhost:3000/time');
        const { fetchData: fetchNames } = useFetch('http://localhost:3000/names');

        fetchNames().then((namesResponse) => {
            names.value = namesResponse
            fetchTime().then((timeResponse) => {
                time.value = timeResponse
                setSensors()

            })
        })
    }

    return {
        getSensorDataById,
        sensors,
        initialize,
        getPosition,
        position,
    }
}

