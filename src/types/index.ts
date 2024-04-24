type CardId = string; //

//Base class interfaces

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';


//Data Model Interfaces

//View Component Interfaces

export interface ICard {
    id: CardId,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null,
}

export interface IOrder {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number | null,
    items: CardId[],
}

export interface IOrderSuccess {
    id: string, //uuid?
    total: number | null,
}

export interface ISuccess {
    image: string,
    title: string,
    description: string,
    total: number | null,
}

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
