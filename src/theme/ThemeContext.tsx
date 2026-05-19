import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../auth/AuthContext';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme, options?: { persistRemote?: boolean }) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'digipros.theme';

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* private mode etc. */
  }
  return 'dark';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const { user, token, updateProfile } = useAuth();
  const hydratedFromUser = useRef<boolean>(false);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (!user) {
      hydratedFromUser.current = false;
      return;
    }
    if (!hydratedFromUser.current && user.theme) {
      setThemeState(user.theme);
      hydratedFromUser.current = true;
    }
  }, [user]);

  const setTheme = useCallback(
    (next: Theme, options?: { persistRemote?: boolean }) => {
      setThemeState(next);
      if (options?.persistRemote && token && user) {
        updateProfile({ theme: next }).catch(() => {
          /* swallow — local state already updated */
        });
      }
    },
    [token, user, updateProfile],
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    if (token && user) {
      updateProfile({ theme: next }).catch(() => undefined);
    }
  }, [theme, token, user, updateProfile]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
