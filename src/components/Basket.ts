import { IBasket } from '../types';
import { ensureElement, createElement } from '../utils/utils';
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('mouseup', () => {
                events.emit('order:open');
            });
        };
        this.items =[];
    };

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true;
        };
    };

    set total(total: number) {
        this.setText(this._total, `${total.toString()} синапсов`);
    };
};