export default function useAuth() {
  const token = useLocalStorage<string | null>("token", null);

  const isLoggedIn = computed(() => {
    return token.value !== null;
  });

  const setToken = (newToken: string | null) => {
    token.value = newToken;
  };

  return {
    isLoggedIn,
    setToken,
  };
}
