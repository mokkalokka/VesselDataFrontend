import { mount } from '@vue/test-utils'
import SensorTable from '@/components/SensorTable.vue'
import { useGroups } from "@/composables/useGroups"
import { ref } from 'vue'

const sensors = [
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
]

useGroups().value = [{
    id: 1,
    sensors: sensors,
    groupDate: true,
    fromDate: new Date().toISOString().slice(0, 10),
    fromTime: new Date().toLocaleTimeString("en-GB"),
    toDate: new Date().toISOString().slice(0, 10),
    toTime: new Date().toLocaleTimeString("en-GB"),
    fromDateTime: new Date(),
    toDateTime: new Date(),
}]

describe('SensorTable.vue', () => {
    const wrapper = mount(SensorTable, {
        props: {
            sensors: sensors
        },
        global: {
            stubs: {
                BIconArrowDownUp: true,
                BIconSearch: true
            }
        }
    })
    it('selectAllSensors', async () => {
        wrapper.vm.selectAllSensors()
        expect(wrapper.vm.selectedSensors.length).toBe(1)
    })
    it('clear selected sensors', async () => {
        wrapper.vm.clearSelectedSensors()
        expect(wrapper.vm.selectedSensors.length).toBe(0)
    })

    it('Sensor pages', async () => {
        await wrapper.find('input').setValue('sensor-11')
        expect(wrapper.vm.sensorPages.length).toBe(0)
    })



})