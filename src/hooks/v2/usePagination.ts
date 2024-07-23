import API from '@src/services/api';
import { AxiosResponse } from 'axios';
import { DataTableBaseProps, DataTableFilterMeta, DataTableFilterMetaData } from 'primereact/datatable';
import { useState } from 'react';
import { QueryKey, useQuery, UseQueryResult } from 'react-query';

interface PaginationOptions {
  uri: string;
  key: QueryKey;
  defaultFilters?: DataTableFilterMeta;
}

interface BuildUrlParams {
  url: string;
  page: number;
  filters: DataTableFilterMeta;
}

const buildUrl = ({ url, page, filters = {} }: BuildUrlParams): string => {
  const queryString = new URLSearchParams();

  if (page > 0) {
    queryString.append('page', String(page + 1));
  }

  Object.entries(filters).forEach(([key, value]: [string, DataTableFilterMetaData]) => {
    if (Array.isArray(value.value)) {
      value.value.forEach((item) => queryString.append(key, item));
    } else if (typeof value.value === 'string' && value.value.trim() !== '') {
      queryString.append(key, value.value);
    }
  });

  const queryParams = queryString.toString();
  return url + (queryParams ? `?${queryParams}` : '');
};

interface ResponseApi {
  pagina: {
    registrosTotales: number;
    paginasTotales: number;
    registrosPorPagina: number;
  };
  data: any[];
}

const usePagination = <TData extends ResponseApi>({
  uri,
  key,
  defaultFilters = {},
}: PaginationOptions): UseQueryResult<AxiosResponse<TData>, unknown> & {
  page: number;
  setPage: (page: number) => void;
  filters: DataTableFilterMeta;
  setFilters: (filters: DataTableFilterMeta) => void;
  tableProps: DataTableBaseProps<any>;
} => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const query = useQuery<AxiosResponse<TData>, unknown>(
    [key, uri, page, filters],
    async ({ signal }) => {
      const url = buildUrl({
        url: uri,
        page,
        filters,
      });
      return API.private().get<any>(url, { signal });
    },
    {
      keepPreviousData: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      isDataEqual: () => false,
    },
  );

  return {
    ...query,
    page,
    setPage,
    filters,
    setFilters,
    tableProps: {
      onPage: (event) => {
        setPage(event.page);
      },
      onFilter: (event) => {
        setFilters(event.filter);
      },
      filters,
      value: query.data.data?.data || [],
      rows: query.data?.data?.pagina?.registrosPorPagina,
      totalRecords: query.data?.data?.pagina?.registrosTotales,
      first: page,
      loading: query.isLoading,
    },
  };
};

export default usePagination;
