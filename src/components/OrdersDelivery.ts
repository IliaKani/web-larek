import { IEvents, IOrdersDelivery } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";

export class OrdersDelivery extends Form<IOrdersDelivery> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this._card = ensureElement<HTMLButtonElement>('#card', this.container);
        this._cash = ensureElement<HTMLButtonElement>('#cash', this.container);
        this._card.classList.add('button_alt-active')

        this.container.addEventListener('click', (evt) => {
            if (evt.target === this._card) {
                this._card.classList.toggle('button_alt-active');
                this._cash.classList.toggle('button_alt-active');
            } else if (evt.target === this._cash) {
                this._cash.classList.toggle('button_alt-active');
                this._card.classList.toggle('button_alt-active');
            }
        })
    };

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    };
};