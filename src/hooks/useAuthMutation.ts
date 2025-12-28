import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token");
      }
      const response = await api.get("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation<
    { message: string; userId: number },
    Error,
    RegisterCredentials
  >({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };
};
