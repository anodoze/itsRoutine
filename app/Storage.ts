import AsyncStorage from '@react-native-async-storage/async-storage';
import { Registry } from './types';

const STORAGE_KEY = '@itsRoutine:registry';

export async function loadRegistry(): Promise<Registry> { // todo: add some real (louder) error handling here
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return { routines: {} };
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load registry:', error);
    return { routines: {} };  
  }
}

export async function saveRegistry(registry: Registry): Promise<void> { // todo: if app size grows: keyed routine storage
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  } catch (error) {
    console.error('Failed to save registry:', error);
  }
}