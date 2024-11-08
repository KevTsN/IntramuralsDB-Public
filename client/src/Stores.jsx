import {create} from 'zustand'



export const useStudentStore = create((set) => ({
    studentID: 0,
    gender: "",
    first: "",
    last: "",
    teams: [],
    // teamMap: new Map(Number, Object),
    updateID: (id) => set(() => ({ studentID: id })),
    updateGender: (gen) => set(() => ({ gender: gen })),
    updateFirst: (nf) => set(() => ({ first: nf })),
    updateLast: (nl) => set(() => ({ last: nl })),
    updateTeams: (tms) => set(()=>({teams: tms}))
  }))