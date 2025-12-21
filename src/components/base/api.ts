import { ApiPostMethods } from "../../types";
import { ApiListResponse, ICard } from "../../types";

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  // Proxy route (webpack-dev-server)
  readonly deeplUrl: string = "/api/deepl/v2/translate";
  readonly deeplAuthKey: string = (process.env.DEEPL_AUTH_KEY as string) ?? "";

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

    if (data?.items && Array.isArray(data.items)) {
      return (await this.translateData(data)) as T;
    }

    return data as T;
  }

  private async translateTexts(texts: string[], targetLang: string = "EN"): Promise<string[]> {
    if (!this.deeplAuthKey) return texts;
    if (!texts.length) return texts;

    const body = new URLSearchParams();
    body.set("auth_key", this.deeplAuthKey);
    body.set("target_lang", targetLang);

    // DeepL accepts multiple `text` params
    for (const t of texts) body.append("text", t);

    const response = await fetch(this.deeplUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      // 429 and other errors: do not crash the app, return originals
      const errText = await response.text().catch(() => "");
      console.warn(
        `DeepL request failed: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ""}`
      );
      return texts;
    }

    const json = await response.json();
    const translations: string[] = (json?.translations ?? []).map((t: any) => t?.text).filter(Boolean);

    // If something went wrong, fall back safely
    if (translations.length !== texts.length) return texts;

    return translations;
  }

  private async translateData(data: ApiListResponse<ICard>): Promise<ApiListResponse<ICard>> {
    const items = data.items ?? [];
    if (!items.length) return data;
    if (!this.deeplAuthKey) return data;

    const fieldsToTranslate: Array<keyof ICard> = ["description", "category", "title"];

    // 1) Flatten all strings we want to translate + remember where each came from
    const texts: string[] = [];
    const refs: Array<{ itemIndex: number; field: keyof ICard }> = [];

    items.forEach((item, itemIndex) => {
      fieldsToTranslate.forEach((field) => {
        const value = item[field];
        if (typeof value !== "string" || !value.trim()) return;
        texts.push(value);
        refs.push({ itemIndex, field });
      });
    });

    // 2) Single DeepL call
    const translated = await this.translateTexts(texts, "EN");

    // 3) Write back
    translated.forEach((t, i) => {
      const ref = refs[i];
      if (!ref) return;
      data.items![ref.itemIndex][ref.field] = t as any;
    });

    return data;
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
