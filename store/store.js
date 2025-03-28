import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(persist(
    (set) => ({
        authToken: null,
        username: null,
        setAuthToken: (token) => set({ authToken: token }),
        setUsername: (username) => set ({ username }),
        logout: () => set({ authToken: null })
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
    }
))

export default useAuthStore;