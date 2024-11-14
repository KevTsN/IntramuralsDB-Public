import {create} from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



export const useStudentStore = create((set) => ({
    studentID: 0,
    gender: "",
    first: "",
    last: "",
    teams: [],
    leagues: [],
    // teamMap: new Map(Number, Object),
    updateID: (id) => set(() => ({ studentID: id })),
    updateGender: (gen) => set(() => ({ gender: gen })),
    updateFirst: (nf) => set(() => ({ first: nf })),
    updateLast: (nl) => set(() => ({ last: nl })),
    updateTeams: (tms) => set(()=>({teams: tms})),
    updateLeagues: (lgs) => set(()=>({leagues: lgs}))

  }))

export const useCurrLeagueStore = create((set) => ({
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

}))

export const useCurrTeamStore = create((set) => ({
  name: "",
  teamID: 0,
  leagueID: 0,
  numPlayers: 0,
  wins: 0,
  losses: 0,
  captainSID: 0,
  playersList: [],
  updateName : (nv) => set(() => ({name: nv})),
  updateTeamID : (nv) => set(() => ({teamID: nv})),
  updateLeagueID : (nv) => set(() => ({leagueID: nv})),
  updateNumPlayers : (nv) => set(() => ({numPlayers: nv})),
  updateCaptainSID : (nv) => set(() => ({captainSID: nv})),
  updatePlayers: (na) => set(() => ({playersList: na}))
  //players by teamid get
}))

