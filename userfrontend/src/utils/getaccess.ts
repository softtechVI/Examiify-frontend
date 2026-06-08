// utils/getaccess.ts 
import useSessionStore from "../store/userSession";

export const getUserRole = (): number | null => {
  return useSessionStore.getState().role;
};

export const getUserPermissions = (): string[] => {
  return useSessionStore.getState().permissions;
};