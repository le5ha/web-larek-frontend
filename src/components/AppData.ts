import { IEvents } from './base/events';
import { IProduct, ProductCategory } from '../types';
import { IOrderForm, IOrder, FormErrors } from '../types';

export class ProductItem implements IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number;
	category: ProductCategory;

	constructor(data: IProduct, protected events: IEvents) {
		Object.assign(this, data);
	}
}

export class AppData {
	catalog: ProductItem[];
	preview: string | null;
	basket: ProductItem[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	formErrors: FormErrors;

	constructor(protected events: IEvents) {
		this.basket = [];
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.events.emit('items:show', { catalog: this.catalog });
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.events.emit('preview:show', item);
	}

	addToCart(item: ProductItem) {
		this.basket.push(item);
		this.order.items.push(item.id);
	}

	deleteFromCart(item: ProductItem) {
		this.basket.splice(
			this.basket.findIndex((i) => i.id === item.id),
			1
		);
		const itemIndexInOrder = this.order.items.findIndex((i) => i === item.id);
		if (itemIndexInOrder !== -1) {
			this.order.items.splice(itemIndexInOrder, 1);
		}
	}

	getTotal(): number {
		return this.basket.reduce((a, item) => a + item.price, 0);
	}

	setOrderField(
		field: keyof IOrderForm,
		value: string,
		isContactsForm: boolean
	) {
		this.order[field] = value;
		if (this.validateOrder(isContactsForm)) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(isContactsForm: boolean) {
		const errors: typeof this.formErrors = {};
		// ошибки валидации
		if (!this.order.payment) {
			errors.address = 'Необходимо выбрать метод оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (isContactsForm) {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
