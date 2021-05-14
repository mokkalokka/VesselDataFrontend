import { mount } from '@vue/test-utils'
import Map from '@/components/Map.vue'
import { useGroups } from "@/composables/useGroups"

jest.mock('@/composables/useSensorData')

const groups = useGroups().value = [{
    id: 1,
    sensors: [
        {
            id: 1,
            filterkey: 'sensor-1',
            sensorName: 'sensor-1',
            description: 'sensor',
            fromDateTime: new Date(),
            toDateTime: new Date(),
            group: 1,
            sensorsToCompare: [],
            graphType: "Linje",
            fromDate: new Date().toISOString().slice(0, 10),
            fromTime: new Date().toLocaleTimeString("en-GB"),
            toDate: new Date().toISOString().slice(0, 10),
            toTime: new Date().toLocaleTimeString("en-GB"),
        }
    ],
    groupDate: true,
    fromDate: new Date().toISOString().slice(0, 10),
    fromTime: new Date().toLocaleTimeString("en-GB"),
    toDate: new Date().toISOString().slice(0, 10),
    toTime: new Date().toLocaleTimeString("en-GB"),
    fromDateTime: new Date(),
    toDateTime: new Date(),
}]


describe('Map.vue', () => {
    const wrapper = mount(Map, {
        props: {
            group: groups[0],
            pointsPerMinute: 60
        },
        global: {
            stubs: {
                LMap: true,
            }
        }
    })
    it('Getting lattitude', () => {
        expect(wrapper.vm.getLatLang()[0]).toBe(61)
    })

    it('Center position', () => {
        expect(wrapper.vm.centerPosition).toStrictEqual([62, 3])
    })

    it('Check slider min max', () => {
        expect([wrapper.vm.min, wrapper.vm.max]).toStrictEqual([0, 2])
    })


})