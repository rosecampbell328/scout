import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/** useState that loads from and saves to AsyncStorage. */
export function usePersistedState<T>(
  key: string,
  initial: T,
  migrate?: (stored: T) => T,
) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw) {
          const stored = JSON.parse(raw) as T;
          setValue(migrate ? migrate(stored) : stored);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
