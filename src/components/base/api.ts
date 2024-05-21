import { ApiPostMethods } from "../../types";
import { ApiListResponse, ICard } from "../../types";

function isKeyOfICard(key: keyof ICard): key is keyof ICard {
    return key === 'description' || key === 'category' || key === 'title';
}

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;
    readonly deeplUrl: string = 'https://api-free.deepl.com/v2/translate';
    readonly deeplAuthKey: string = '30d68e42-9b7c-4499-ac64-2b6538c98f0b:fx';

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            const data = await response.json();
            const translatedData = await this.translateData(data);
            return translatedData as T;
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    private async translateData(data: ApiListResponse<ICard>): Promise<ApiListResponse<ICard>> {
    if (data.items) {
        for (let i = 0; i < data.items.length; i++) {
            const fieldsToTranslate = ['description', 'category', 'title'];
            for (const field of fieldsToTranslate) {
                if (isKeyOfICard(field as keyof ICard)) {
                    const response = await fetch(this.deeplUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `auth_key=${this.deeplAuthKey}&text=${encodeURIComponent(data.items[i][field])}&target_lang=EN`
                    });
                    const translatedData = await response.json();
                    if (translatedData.translations && translatedData.translations.length > 0) {
                        data.items[i][field] = translatedData.translations[0].text;
                    } else {
                        throw new Error(`Translation failed for field ${field}`);
                    }
                }
            }
        }
    }
    return data;
}

    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(response => this.handleResponse<T>(response));
    }
    
    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(response => this.handleResponse<T>(response));
    }
}