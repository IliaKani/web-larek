import { ApiListResponse, ICard, ILarekApi, IOrder, IOrderSuccess } from "../types";
import { Api } from "./base/api";

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getCardsList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    };

    getCard(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    };

    orderProducts(order: IOrder): Promise<IOrderSuccess> {
        return this.post(`/order`, order).then(
            (data: IOrderSuccess) => data
        );
    };
};