import { ApiPostMethods } from "../../types";
import { ApiListResponse, ICard } from "../../types";

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        "Content-Type": "application/json",
        ...(((options.headers as object) ?? {}) as object),
      },
    };
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      return Promise.reject(err.error ?? response.statusText);
    }

    const data = await response.json();
    return data as T;
  }

  get<T>(uri: string): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: "GET",
    }).then((response) => this.handleResponse<T>(response));
  }

  post<T>(uri: string, data: object, method: ApiPostMethods = "POST"): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    }).then((response) => this.handleResponse<T>(response));
  }
}
