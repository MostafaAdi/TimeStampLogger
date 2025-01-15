import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

function useToggle(key: string, initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  // Load the persisted value from AsyncStorage when the component mounts
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error('Failed to load value from AsyncStorage', error);
      }
    };

    loadValue();
  }, []);

   // Persist the value to AsyncStorage whenever it changes
   useEffect(() => {
    const saveValue = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save value to AsyncStorage', error);
      }
    };

    saveValue();
  }, [value]);

  // Define a function to toggle the state
  const toggle = useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  return [value, toggle] as const;
}

export default useToggle;