import { ref } from 'vue'
import { Group } from '@/Interfaces/groupInterface';

const groups = ref([] as Group[])
const tempGroups = ref([] as Group[]);

export function useGroups() {
    return groups;
}

export function useTempGroups() {
    return tempGroups;
}