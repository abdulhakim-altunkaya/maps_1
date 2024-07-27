// src/store/useStore.js
import { create } from 'zustand'; // Use named import

const useStore = create((set) => ({
  provincePopulation: 0,
  setProvincePopulation: (newPopulation) => set({ provincePopulation: newPopulation }),
}));

export default useStore;