import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from './base/Component';

 const categories: {[key: string]: string} = {
    "софт-скил": "card__category_soft",
    "хард-скил": "card__category_hard",
    "кнопка": "card__category_button",
    "дополнительное": "card__category_additional",
    "другое": "card__category_other"
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price?: HTMLElement;
    protected _count?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._category = container.querySelector('.card__category')
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = container.querySelector('.card__image');
        this._button = container.querySelector('.button');
        this._description = container.querySelector('.card__text');
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._count = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

    set price(value: number | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, `${value.toString()} синапсов`);
    }

    get price(): number {
        return Number(this._price.textContent) || null;
    }

    set index(value: string) {
        this._count.textContent = value;
      }
    
      get index(): string {
        return this._count.textContent || '';
      }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(categories[value]);
    }

    get category() {
        return this._category.textContent || '';
    }

    set buttonText(value: string) {
        if (this._button) {
          this._button.textContent = value;
        }
      }
}