import axios from 'axios';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import API from 'src/services/api';

const usePagination = ({ uri, key }) => {
  const [page, setPage] = useState(0);
  const [ordering, setOrdering] = useState(null);
  const [search, changeSearch] = useState('');
  const [filters, setFilters] = useState<any>({});

  const construirUrl = useCallback(({ uri, page, ordering, search, filters = {} }: any) => {
    const object: any = {};
    if (ordering && ordering?.length > 0) {
      object.ordering = ordering.map((sort) => `${sort.order === 1 ? '' : '-'}${sort.field}`).join(',');
    }
    if (page && page > 0) {
      object.page = page + 1;
    }
    if (search && search !== '') {
      object.search = search;
    }
    const entries = Object.entries(filters);
    if (entries.length > 0) {
      entries.forEach(([key, value]) => {
        if (value) object[key] = value;
      });
    }

    const qString = new URLSearchParams(object).toString();
    const qParams = qString ? `?${qString}` : '';
    return uri + qParams;
  }, []);

  const response = useQuery(
    [key, page, ordering, search, filters],
    () => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const promise = API.private({
        cancelToken: source.token,
      }).get(
        construirUrl({
          uri,
          page,
          ordering,
          search,
          filters,
        }),
      );
      //@ts-ignore
      promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
      };

      return promise;
    },
    {
      keepPreviousData: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      isDataEqual: () => false,
    },
  );

  return {
    ...response,
    setPage,
    page,
    setOrdering,
    ordering,
    setSearch(evt: any) {
      if (evt?.target?.value) {
        return changeSearch(`${evt?.target?.value}`);
      }
      changeSearch('');
    },
    filters,
    changeFilter(evt: any) {
      if (evt.target.name && evt.target.value) {
        setFilters({
          ...filters,
          [evt.target.name]: evt.target.value || null,
        });
      }
    },
    search,
  };
};

export default usePagination;
