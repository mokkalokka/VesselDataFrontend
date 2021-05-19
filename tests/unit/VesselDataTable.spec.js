import { mount } from '@vue/test-utils'
import VesselDataTable from '@/components/VesselDataTable.vue'

describe('VesselDataTable.vue', () => {
    it('checks filter method', () => {
        const wrapper = mount(VesselDataTable, {
            global: {
                stubs: {
                    BIconArrowDownUp: true,
                }
            }
        })
        expect(wrapper.vm.filter({ id: 1, name: "Titanic" })).toBe(true)
    })
    it('Checks sorted vessel array', async () => {
        const wrapper = mount(VesselDataTable, {
            global: {
                stubs: {
                    BIconArrowDownUp: true,
                }
            }
        })
        await expect(wrapper.find('[data-test="vessels"]').text()).toBe('Navn');
    })
})