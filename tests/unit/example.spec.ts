import { mount } from '@vue/test-utils'
import VesselDataTable from '@/components/VesselDataTable.vue'
import AddedSensorTable from "@/components/AddedSensorTable.vue"
import SensorTable from "@/components/SensorTable.vue"
import { resetTempGroups, useGroups, useTempGroups } from "@/composables/useGroups"

describe('VesselDataTable.vue', () => {
  it('checks filter method', () => {
    const wrapper = mount(VesselDataTable, {})
    expect(wrapper.vm.filter({ id: 1, name: "Titanic" })).toBe(true)
  })
  it('Checks sorted vessel array', async () => {
    const wrapper = mount(VesselDataTable, {})
    await expect(wrapper.find('[data-test="vessels"]').text()).toBe('Navn');
  })
})

describe('useGroups.ts', () => {
  it('see if useTempGroups has default element', () => {
    expect(useTempGroups().value).toHaveLength(1)
  })
  it('see if useGroups is empty', () => {
    expect(useGroups().value).toHaveLength(0)
  })
  it('see if useTempGroups is reset on resetTempGroups', async () => {

    const tempGroups = useTempGroups();
    tempGroups.value.push(
      {
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
    );

    await resetTempGroups();

    await expect(tempGroups.value).toHaveLength(1);
  })
})

describe('AddedSensorTable.vue', () => {
  it('checks if groups is set equal to tempgroup', async () => {
    const wrapper = mount(AddedSensorTable, {});
    wrapper.vm.setGroupsToRender();
    await expect(useGroups()).toEqual(useTempGroups());
  })
  it('checks if toggleDate toggles date correctly', async () => {

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

    const wrapper = mount(AddedSensorTable, {});
    wrapper.vm.toggleDate(group)
    await expect(group.groupDate).toBe(false)
  })
})