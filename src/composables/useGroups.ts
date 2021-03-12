import { ref } from 'vue'
import { Group } from '@/Interfaces/groupInterface';

const groups = ref([] as Group[])
export function useGroups() {

    return groups;

}