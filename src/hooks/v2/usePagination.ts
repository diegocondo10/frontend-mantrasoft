import API from '@src/services/api';
import { AxiosError, AxiosResponse } from 'axios';
import {
  DataTableBaseProps,
  DataTableFilterMeta,
  DataTableFilterMetaData,
  DataTableSortMeta,
} from 'primereact/datatable';
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
  ordering: DataTableSortMeta[];
}

const buildUrl = ({ url, page, filters = {}, ordering }: BuildUrlParams): string => {
  const queryString = new URLSearchParams();
  if (ordering) {
    const orderString = ordering.map((sort) => `${sort.order === 1 ? '' : '-'}${sort.field}`).join(',');
    if (orderString !== '') {
      queryString.append('ordering', orderString);
    }
  }
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

interface Pagination {
  registrosTotales: number;
  paginasTotales: number;
  registrosPorPagina: number;
}

interface ResponseApi<T> {
  pagina: Pagination;
  data: T[];
}

const usePagination = <TData extends ResponseApi<any>>({
  uri,
  key,
  defaultFilters = {},
}: PaginationOptions): UseQueryResult<AxiosResponse<TData>, AxiosError> & {
  page: number;
  setPage: (page: number) => void;
  filters: DataTableFilterMeta;
  setFilters: (filters: DataTableFilterMeta) => void;
  tableProps: DataTableBaseProps<any>;
} => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [multiSortMeta, setMultiSortMeta] = useState([]);

  const query = useQuery<AxiosResponse<TData>, AxiosError>(
    [key, uri, page, filters, multiSortMeta],
    async ({ signal }) => {
      const url = buildUrl({ url: uri, page, filters, ordering: multiSortMeta });
      return API.private().get<TData>(url, { signal });
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
      onPage: (event) => setPage(event.page),
      onFilter: (event) => setFilters(event.filters),
      filters,
      value: query.data?.data?.data || [],
      rows: query.data?.data?.pagina?.registrosPorPagina,
      totalRecords: query.data?.data?.pagina?.registrosTotales,
      first: page,
      loading: query.isLoading,
      multiSortMeta: multiSortMeta,
      onSort: (event) => setMultiSortMeta(event.multiSortMeta),
    },
  };
};

export default usePagination;
