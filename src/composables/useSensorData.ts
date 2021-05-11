
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"
import { Sensor } from "@/Interfaces/sensorInterface"

const sensors = ref([] as Sensor[])
const position = ref([])
const time = ref([])
const names = ref([])



export function useSensorData() {

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

    async function getSensorDataById(sensorIds: number[]) {
        const data = ref([])
        const baseUrl = 'http://localhost:3000/'
        //Adds time 
        const urls = [baseUrl + 'time']

        sensorIds.map(id => urls.push(baseUrl + names.value[id]))

        data.value = await Promise.all(urls.map(url => {
            const { fetchData } = useFetch(url);
            return fetchData()
        }))

        return data.value
    }

    async function getPosition() {
        const data = ref([])
        const baseUrl = 'http://localhost:3000/'
        const urls = [
            baseUrl + 'Nav_Pos.lat',
            baseUrl + 'Nav_Pos.lon'
        ]

        data.value = await Promise.all(urls.map(url => {
            const { fetchData } = useFetch(url);
            return fetchData()
        }))

        data.value.push(time.value)

        return data.value

    }


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

