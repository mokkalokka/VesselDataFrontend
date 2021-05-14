import { mount } from '@vue/test-utils'
import Echarts from '@/components/Echarts.vue'
import { useGroups } from "@/composables/useGroups"
jest.mock('@/composables/useSensorData')

useGroups().value = [{
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

describe('Echarts.vue', () => {
    const wrapper = mount(Echarts, {
        props: {
            sensorNames: ['sensor-1', 'sensor-2'],
            sensorIds: [1, 2],
            groupId: 1,
            pointsPerMinute: 60,
        },
        global: {
            stubs: {
                Echarts: true,

            }
        }
    })
    it('Fetching sensor data right data', () => {
        expect(wrapper.vm.options.series[0].data[0][1]).toBe(1)
    })

    it('Graph title', () => {
        expect(wrapper.vm.getGraphTitle).toBe('sensor-1, sensor-2')
    })
    it('CurrentGroup', () => {
        expect(wrapper.vm.currentGroup.id).toBe(1)
    })
})