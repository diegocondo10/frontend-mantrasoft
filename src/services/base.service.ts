import { PK, ReportResponse } from '@src/types/api';
import { AxiosInstance, AxiosResponse, isAxiosError, Method } from 'axios';
import API from './api';
import { ApiException } from './service.exceptions';
import { BaseURLs } from './service.types';

export class BaseService<T extends BaseURLs> {
  private _privateApi: AxiosInstance;
  private _publicApi: AxiosInstance;

  constructor(public urls: T) {
    this._privateApi = API.private();
    this._publicApi = API.public();
  }

  public get privateApi(): AxiosInstance {
    return this._privateApi;
  }

  public get publicApi(): AxiosInstance {
    return this._publicApi;
  }

  public async request<R>(
    method: Method,
    url: string,
    data?: any,
    validateStatus: (status: number) => boolean = (status) => status >= 200 && status < 300,
    usePublicApi: boolean = false,
  ): Promise<AxiosResponse<R>> {
    const apiInstance = usePublicApi ? this._publicApi : this._privateApi;
    try {
      const response = await apiInstance.request<R>({
        method,
        url,
        data,
        validateStatus,
      });
      if (validateStatus(response.status)) {
        return response;
      }
      throw new ApiException(`Error with status code ${response.status}`, response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async requestReport<B>(url: string, body: B | any = {}, defaultFilename = null): Promise<ReportResponse> {
    const response = await this.privateApi.post(url, body, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];

    let filename = defaultFilename;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    return {
      data: response.data,
      filename,
    };
  }

  async create<T>(data: T): Promise<AxiosResponse> {
    return this.request('post', this.urls.create, data, (status) => status === 201);
  }

  async update<T>(id: PK, data: T): Promise<AxiosResponse> {
    return this.request('put', this.urls.update(id), data, (status) => status === 200);
  }

  async delete(id: PK): Promise<void> {
    await this.request('delete', this.urls.delete(id));
  }

  async retrieve(id: PK): Promise<AxiosResponse> {
    return this.request('get', this.urls.retrieve(id), undefined, (status) => status === 200);
  }

  protected handleError(error: any): never {
    if (isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new ApiException('API Error', data.errors);
    }
    throw new Error('Unexpected Error');
  }
}
