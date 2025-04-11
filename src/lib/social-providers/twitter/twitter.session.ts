type TwitterSessionData = {
  userId: string;
  clientId: string;
  createdAt: number;
  codeVerifier: string;
};

const sessions = new Map<string, TwitterSessionData>();

export const TwitterSessionStore = {
  set(token: string, data: TwitterSessionData) {
    sessions.set(token, { ...data, createdAt: Date.now() });
  },

  get(token: string): TwitterSessionData | null {
    const data = sessions.get(token);
    if (!data) return null;

    // Expire after 5 mins
    const isExpired = Date.now() - data.createdAt > 10 * 60 * 1000;
    if (isExpired) {
      sessions.delete(token);
      return null;
    }

    return data;
  },

  delete(token: string) {
    sessions.delete(token);
  },
};

export function getCodeVerifierFromSession(oauthToken: string): string {
  const session = TwitterSessionStore.get(oauthToken);
  if (!session) throw new Error('Session not found');
  return session.codeVerifier;
}
