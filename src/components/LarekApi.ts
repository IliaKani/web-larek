import { ApiListResponse, ICard, ILarekApi, IOrder, IOrderSuccess } from "../types";
import { Api } from "./base/api";

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getCardsList(): Promise<ICard[]> {
        return this.get<ApiListResponse<ICard>>('/product').then((data) =>
            data && data.items ? data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            })) : []
        );
    }

    orderProducts(order: IOrder): Promise<IOrderSuccess> {
        return this.post(`/order`, order).then(
            (data: IOrderSuccess) => data
        );
    };
};