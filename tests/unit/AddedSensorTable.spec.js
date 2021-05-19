import { mount } from '@vue/test-utils'
import AddedSensorTable from "@/components/AddedSensorTable.vue"
import { useGroups, useTempGroups } from "@/composables/useGroups"


const group = {
    id: 2,
    sensors: [],
    groupDate: true,
    fromDate: new Date().toISOString().slice(0, 10),
    fromTime: new Date().toLocaleTimeString("en-GB"),
    toDate: new Date().toISOString().slice(0, 10),
    toTime: new Date().toLocaleTimeString("en-GB"),
    fromDateTime: new Date(),
    toDateTime: new Date(),
}

describe('AddedSensorTable.vue', () => {
    const wrapper = mount(AddedSensorTable, {
        global: {
            stubs: {
                Multiselect: true,

            }
        }
    });

    it('checks if groups is set equal to tempgroup', async () => {
        wrapper.vm.setGroupsToRender();
        await expect(useGroups()).toEqual(useTempGroups());
    })
    it('checks if toggleDate toggles date correctly', async () => {

        wrapper.vm.toggleDate(group)
        await expect(group.groupDate).toBe(false)
    })
})