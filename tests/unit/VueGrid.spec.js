import { mount } from '@vue/test-utils'
import VueGrid from '@/components/VueGrid.vue'
import { useGroups } from "@/composables/useGroups"


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


describe('VueGrid.vue', () => {
    const wrapper = mount(VueGrid, {
        props: {
            groupId: 1
        },
        global: {
            stubs: {
                Echarts: true,
                'grid-item': true,
                'grid-layout': true
            }
        }
    })
    it('Changing points per minute', async () => {
        const options = wrapper.find('#pointsPerMinuteSelect').findAll('option')
        await options[1].setSelected()
        expect(wrapper.vm.pointsPerMinute).toBe(15)
    })

    it('Toggle reorder', async () => {
        wrapper.vm.toggleReorder()
        expect(wrapper.vm.draggable).toBe(true)
    })

    it('Toggle map', async () => {
        wrapper.vm.toggleMap()
        expect(wrapper.vm.layout.length).toBe(2)
    })

    it('Grid layout height', async () => {
        wrapper.vm.toggleMap()
        expect(wrapper.vm.gridLayoutHeight).toBe(420)
    })

})