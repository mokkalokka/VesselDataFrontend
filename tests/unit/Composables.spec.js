import { ref } from 'vue'
import { useSensorData } from "@/composables/useSensorData";
import { useVessels, getVesselById } from "@/composables/useVessels";
import { resetTempGroups, useGroups, useTempGroups } from "@/composables/useGroups"
jest.mock('@/composables/useFetch.ts')

const mockUseFetch = require('@/composables/useFetch.ts');

describe('useSensorData.ts', () => {
    const { getSensorDataById, initialize, sensors } = useSensorData();

    it('Fetching sensors by id', () => {
        getSensorDataById([0, 2], 60).then((res) => {
            expect(res.length).toBe(3)
        })
    })
})

describe('useVessels.ts', () => {
    const { fetchVessels, vessels } = useVessels();

    vessels.value = [{
        "name": "Hurtigruta",
        "id": 1
    }]

    expect(getVesselById(1).name).toBe('Hurtigruta');
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
