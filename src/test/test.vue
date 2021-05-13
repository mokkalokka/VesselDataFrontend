<script>
import { mount } from '@vue/test-utils'
import vesselDataTable from '../../src/views/VesselData.vue'

test('renders a todo', () => {
  const wrapper = mount(vesselDataTable)

  expect(wrapper.filter({id: 1, name: "Titanic"})).toBe(false)
})
</script>