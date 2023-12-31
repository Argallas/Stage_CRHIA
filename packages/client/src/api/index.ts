/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * @celluloid/server
 * Celluloid backend
 * OpenAPI spec version: 2.0.0
 */
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import type {
  ProjectGraphRecord,
  ProjectResult,
  CreateProject500,
  ProjectCreateData,
} from "./model";

export const getProjects = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse<ProjectGraphRecord[]>> => {
  return axios.get(`/api/projects`, options);
};

export const getGetProjectsQueryKey = () => [`/api/projects`];

export type GetProjectsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProjects>>
>;
export type GetProjectsQueryError = AxiosError<unknown>;

export const useGetProjects = <
  TData = Awaited<ReturnType<typeof getProjects>>,
  TError = AxiosError<unknown>
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getProjects>>,
    TError,
    TData
  >;
  axios?: AxiosRequestConfig;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetProjectsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProjects>>> = ({
    signal,
  }) => getProjects({ signal, ...axiosOptions });

  const query = useQuery<
    Awaited<ReturnType<typeof getProjects>>,
    TError,
    TData
  >(queryKey, queryFn, queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryKey;

  return query;
};

export const createProject = (
  projectCreateData: ProjectCreateData,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<ProjectResult>> => {
  return axios.post(`/api/projects`, projectCreateData, options);
};

export type CreateProjectMutationResult = NonNullable<
  Awaited<ReturnType<typeof createProject>>
>;
export type CreateProjectMutationBody = ProjectCreateData;
export type CreateProjectMutationError = AxiosError<CreateProject500>;

export const useCreateProject = <
  TError = AxiosError<CreateProject500>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createProject>>,
    TError,
    { data: ProjectCreateData },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createProject>>,
    { data: ProjectCreateData }
  > = (props) => {
    const { data } = props ?? {};

    return createProject(data, axiosOptions);
  };

  return useMutation<
    Awaited<ReturnType<typeof createProject>>,
    TError,
    { data: ProjectCreateData },
    TContext
  >(mutationFn, mutationOptions);
};
