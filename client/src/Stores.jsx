import {create} from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



export const useStudentStore = create((
  persist((set, get) =>({
    studentID: 0,
    gender: "",
    first: "",
    last: "",
    teams: [],
    leagues: [],
    outRequests: [],
    // teamMap: new Map(Number, Object),
    updateID: (id) => set(() => ({ studentID: id })),
    updateGender: (gen) => set(() => ({ gender: gen })),
    updateFirst: (nf) => set(() => ({ first: nf })),
    updateLast: (nl) => set(() => ({ last: nl })),
    updateTeams: (tms) => set(()=>({teams: tms})),
    updateLeagues: (lgs) => set(()=>({leagues: lgs})),
    updateRequests: (rqs) => set(()=>({outRequests: rqs}))
  }),
  {
    name: 'student-storage',
    storage: createJSONStorage(() => sessionStorage),
  },
))
)

export const useCurrLeagueStore = create((
  persist((set, get) =>({
    skillLevel: 0,
    numTeams: 0,
    sport: "",
    maxTeams: 0,
    genders: "",
    maxPlayers: 0,
    leagueID: 0,
    updateID: (id) => set(() => ({leagueID: id })),
    updateNumTeams: (num) => set(() => ({ numTeams: num })),
    updateMaxTeams: (num) => set(() => ({ maxTeams: num })),
    updateSport: (sp) => set(() => ({ sport: sp })),
    updateMaxPlayers: (num) => set(() => ({ maxPlayers: num })),
    updateGenders: (gnd) => set(()=>({genders: gnd})),
    updateLevel: (lvl) => set(()=>({skillLevel: lvl}))
  }),
  {
    name: 'league-storage',
    storage: createJSONStorage(() => sessionStorage),
  },
))
)

export const useCurrTeamStore = create((
persist((set, get) =>({
  name: "",
  teamID: 0,
  leagueID: 0,
  numPlayers: 0,
  wins: 0,
  losses: 0,
  captainSID: 0,
  newCapID: 0,
  playersList: [],
  requestsList: [],
  invitesSentList: [],
  invitesRecList: [],

  updateName : (nv) => set(() => ({name: nv})),
  updateTeamID : (nv) => set(() => ({teamID: nv})),
  updateLeagueID : (nv) => set(() => ({leagueID: nv})),
  updateNumPlayers : (nv) => set(() => ({numPlayers: nv})),
  updateCaptainSID : (nv) => set(() => ({captainSID: nv})),
  updatePlayers: (na) => set(() => ({playersList: na})),
  updateRequests: (na) => set(() => ({requestsList: na})),
  updateInvitesSent: (na) => set(() => ({invitesSentList: na})),
  updateInvitesRec: (na) => set(() => ({invitesRecList: na})),

  updateNewCap: (nv) => set(() => ({newCapID: nv})) 
}),
{
  name: 'team-storage',
  storage: createJSONStorage(() => sessionStorage),
},
))
)