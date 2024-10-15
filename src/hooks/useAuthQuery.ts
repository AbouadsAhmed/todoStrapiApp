import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../config/Config";
import { AxiosRequestConfig } from "axios";
interface IUseAuthQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}
const useAuthQuery = ({ queryKey, url, config }: IUseAuthQuery) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await AxiosInstance.get(url, config);
      return data;
    },
  });
};
export default useAuthQuery;
