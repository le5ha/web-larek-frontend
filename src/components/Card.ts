import { Component } from './base/Component';
import { ensureElement, formatNumber } from '../utils/utils';
import { IProduct, ICardActions } from '../types';
import { ProductCategory } from '../types';
// категории карточек
const cardCategories: Record<ProductCategory, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
};

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);

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

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: ProductCategory) {
		// убеждаемся, что ставится новая категория
		Object.values(cardCategories).forEach((categoryClass) => {
			this._category.classList.remove(categoryClass);
		});
		this._category.classList.add(cardCategories[value]);
		this.setText(this._category, value);
	}

	set price(value: number) {
		let text: string;
		// если цена есть, то показываем её, иначе пишем "бесценно"
		if (value) {
			text = `${formatNumber(value)} синапсов`;
		} else {
			text = 'Бесценно';
		}
		this.setText(this._price, text);
	}

	setDeleteButton() {
		this.setText(this._button, 'Удалить из корзины');
	}	

	render(data?: Partial<IProduct>, isInCart?: boolean): HTMLElement {
		Object.assign(this as object, data ?? {});
		if (!data.price) {
			this.setDisabled(this._button, true);
		}
		if(isInCart) {
			this.setDeleteButton();
		}
		return this.container;
	}
}
