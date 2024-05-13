import { IActions, IEvents, IOrdersDelivery } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";

export const paymentMethod: {[key: string]: string} = {
    "card": "online",
    "cash": "cash",
}

export class OrdersDelivery extends Form<IOrdersDelivery> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions: IActions) {
        super(container, events)

        this._card = ensureElement<HTMLButtonElement>('#card', this.container);
        this._cash = ensureElement<HTMLButtonElement>('#cash', this.container);
        this._button = container.querySelector('.order__button');
        this._card.classList.add('button_alt-active');

        this.container.addEventListener('click', (evt) => {
            if (evt.target === this._card) {
                this._card.classList.add('button_alt-active');
                this._cash.classList.remove('button_alt-active');
            } else if (evt.target === this._cash) {
                this._cash.classList.add('button_alt-active');
                this._card.classList.remove('button_alt-active');
            };
        });
        if (this._button) {
            this._button.addEventListener('mouseup', () => {
                events.emit('contacts:open');
            });
        };
    };


    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    };
};