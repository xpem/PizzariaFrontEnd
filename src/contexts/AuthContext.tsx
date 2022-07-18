import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useState } from "react";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  signUp: (credentials: SignUpProps) => Promise<void>;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

type UserProps = { id: string; name: string; email: string };

type SignInProps = { email: string; password: string };

type SignUpProps = { name: string; email: string; password: string };

type AuthProviderProps = { children: ReactNode };

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    console.log("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);

  //if have a user, isAuthenticated
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", { email, password });

      const { id, name, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30 /*expire in 1 month*/,
        path: "/",
      });

      setUser({
        id,
        name,
        email,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso!");

      Router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao acessar");
      console.log("Erro ao acessar", err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/user", { name, email, password });

      toast.success("Conta criada");
      Router.push("/");
    } catch (err) {
      toast.error("Erro ao cadastrar");
      console.log("Erro ao cadastrar", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
