import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ME_QUERY } from '../graphql/queries';
import { LOGOUT_MUTATION } from '../graphql/mutations';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const client = useApolloClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { data, loading, refetch } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      setCurrentUser(data?.me || null);
      setAuthLoading(false);
    },
    onError: () => {
      setCurrentUser(null);
      setAuthLoading(false);
    },
  });

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    await logoutMutation();
    setCurrentUser(null);
    await client.clearStore();
  };

  const refreshUser = () => refetch();

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
