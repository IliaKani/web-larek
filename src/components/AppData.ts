import { FormErrors, IAppStatus, ICard, IOrder, IOrdersContacts, IOrdersDelivery } from '../types/index';
import { Model } from './base/Model';
import _ from "lodash";

export type CatalogChangeEvent = {
    catalog: ICard[]
};

export class AppStatus extends Model<IAppStatus> {
    catalog: ICard[];
    basket: ICard[] = [];
    order: IOrder = {
        payment: 'online',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    }
    preview: string | null;
    formErrors: FormErrors = {}

    setCards(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', {cards: this.catalog})
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item)
    }

    addItemToBasket(item: ICard) {
        this.basket.indexOf(item) < 1 ?
        this.basket.push(item) : 
        false;
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket);
    }

    deleteItemFromBasket(item: ICard) {
        this.basket = this.basket.filter(elem => elem != item);
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket);
    }

    setOrdersDelivery(field: keyof IOrdersDelivery, value: string) {
        this.order[field] = value;
        this.checkDeliveryValidation() ?  
        this.events.emit('ordersDelivery:changed', this.order) : 
        false;
    }

    setOrdersContacts(field: keyof IOrdersContacts, value: string) {
        this.order[field] = value;
        this.checkContactsValidation() ?  
        this.events.emit('ordersContacts:changed', this.order) : 
        false;
    }

    checkDeliveryValidation() {
        const error: typeof this.formErrors = {};
        const addresRegexp = /^[a-z0-9,./\-/\s]+$/i;
        if (!addresRegexp.test(this.order.address) || !this.order.address) {
            error.address = 'Enter the address in a valid format: alphanumeric, spaces, commas, dots and dashes'
        };

        this.formErrors = error;
        this.events.emit('deliveryForm:changed', this.formErrors)
        return Object.keys(error).length === 0;
    }

    checkContactsValidation() {
        const error: typeof this.formErrors = {};
        const emailRegepx = /^[a-zA-Z0-9._]+@[a-z]+.[a-z]{2,5}$/;
        const phoneRegexp = /^[\+49](\d){10,11}$/;
        if (!emailRegepx.test(this.order.email) || !this.order.email) {
            error.email = 'Enter your email in the format email@email.com'
        }
        if (!phoneRegexp.test(this.order.phone) || !this.order.phone) {
            error.phone = 'Enter your phone number in the format +49ХХХХХХХХХХ'
        }
        this.formErrors = error;
        this.events.emit('contactsForm:changed', this.formErrors)
        return Object.keys(error).length === 0;
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket)
    }
}