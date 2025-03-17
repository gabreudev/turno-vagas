'use client';

import type { JSX } from 'react';
import { useState, useContext, createContext, useEffect } from 'react';
import type { LoginRequestDto } from '@/common/validations/auth/login/login-request.dto';
import type { LoginTokenDto } from '@/common/validations/auth/login/login-response.dto';
import { decode } from 'jsonwebtoken';
import type { ResponseWithError } from '@/app/actions';
import { createUser, login as loginAction } from '@/app/actions';
import { useGetCookieValue } from '@/hooks/use-get-cookie-value';
import { getCookieExpirationDate } from '@/utils/get-cookie-expiration-date';
import { COOKIE_USER_TOKEN_KEY } from '@/common/constants/cookie';
import type { CreateUserRequestDto } from '@/common/validations/users/create-user/create-user-request.dto';
import type { CreateUserStringDatesResponseDto } from '@/common/validations/users/create-user/create-user-response.dto';

const COOKIE_EXPIRATION_MINUTES = 60 * 24 * 30; // 30 days

function parseCookieUserToken(token: string): LoginTokenDto | null {
  try {
    const userToken = decode(token) as LoginTokenDto | null;

    if (!userToken?.exp || new Date(userToken.exp * 1000) <= new Date()) {
      return null;
    }

    return userToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

function updateCookie(key: string, value: string): void {
  document.cookie = `${key}=${value}; path=/; expires=${getCookieExpirationDate(COOKIE_EXPIRATION_MINUTES).toUTCString()}; secure; SameSite=Strict;`;
}

function removeCookie(key: string): void {
  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

interface AuthContextState {
  user: LoginTokenDto | null;
  login: (
    loginRequestDto: LoginRequestDto,
  ) => Promise<ResponseWithError<LoginTokenDto>>;
  register: (
    createUserRequestDto: CreateUserRequestDto,
  ) => Promise<ResponseWithError<CreateUserStringDatesResponseDto>>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  const userToken = useGetCookieValue(COOKIE_USER_TOKEN_KEY);

  const [user, setUser] = useState<LoginTokenDto | null>(
    userToken ? parseCookieUserToken(userToken) : null,
  );

  async function login(
    loginRequestDto: LoginRequestDto,
  ): Promise<ResponseWithError<LoginTokenDto>> {
    const response = await loginAction(loginRequestDto);

    if (!response.ok) {
      return response;
    }

    const userData = decode(response.data.token) as LoginTokenDto;

    updateCookie(COOKIE_USER_TOKEN_KEY, response.data.token);

    setUser(userData);

    return {
      ok: true,
      data: userData,
      error: undefined,
    };
  }

  async function register(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<ResponseWithError<CreateUserStringDatesResponseDto>> {
    return createUser(createUserRequestDto);
  }

  function logout(): void {
    removeCookie(COOKIE_USER_TOKEN_KEY);
    setUser(null);
  }

  const isAuthenticated = Boolean(user);

  useEffect(
    function getUserData(): void {
      setUser(userToken ? parseCookieUserToken(userToken) : null);
    },
    [userToken],
  );

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
