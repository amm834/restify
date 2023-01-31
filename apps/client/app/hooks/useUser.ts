import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export function useUser() {
  const { data, error, isLoading } = useSWR<IUser>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/me`,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
