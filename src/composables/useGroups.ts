import { ref } from 'vue'
import { Group } from '@/Interfaces/groupInterface';
const currentDate = new Date();
const groups = ref([] as Group[])

const tempDate = new Date()
tempDate.setHours(tempDate.getHours() - 1);

const tempGroups = ref([{
    id: 1,
    sensors: [],
    groupDate: true,
    fromDate: tempDate.toISOString().slice(0, 10),
    fromTime: tempDate.toLocaleTimeString("en-GB"),
    toDate: currentDate.toISOString().slice(0, 10),
    toTime: currentDate.toLocaleTimeString("en-GB"),
    fromDateTime: currentDate,
    toDateTime: currentDate,
}])


export function useGroups() {
    return groups;
}

export function useTempGroups() {
    return tempGroups;
}

export function resetTempGroups() {
    tempGroups.value = [{
        id: 1,
        sensors: [],
        groupDate: true,
        fromDate: tempDate.toISOString().slice(0, 10),
        fromTime: tempDate.toLocaleTimeString("en-GB"),
        toDate: currentDate.toISOString().slice(0, 10),
        toTime: currentDate.toLocaleTimeString("en-GB"),
        fromDateTime: currentDate,
        toDateTime: currentDate,
    }];
}

export function resetGroups() {
    groups.value = [];
}