import { IEvents } from './base/events';
import { IProduct, ProductCategory } from '../types';
import { IOrderForm, IOrder, FormErrors } from '../types';

export class AppData {
    catalog: IProduct[];
    preview: string | null;
    basket: IProduct[];
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
		this.catalog = items;
		this.events.emit('items:show', { catalog: this.catalog });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.events.emit('preview:show', item);
	}

	addToCart(item: IProduct) {
		this.basket.push(item);
	}

	deleteFromCart(item: IProduct) {
		this.basket = this.basket.filter((i) => i.id !== item.id);
	}

	getCartItems() {
		return this.basket;
	}
	
// новый метод очистки корзины
	clearCart() {
		this.basket = [];
	}

	getTotal(): number {
		return this.basket.reduce((a, item) => a + item.price, 0);
	}

	setOrderItems() {
		this.order.items = this.basket.map(item => item.id);
		this.order.total = this.getTotal();
	  }

	  setOrderField(
		field: keyof IOrderForm,
		value: string,
		isContactsForm: boolean
	) {
		this.order[field] = value;
		if (this.validateOrder(isContactsForm)) {
			if (field === 'payment' && value) {
				this.order.total = this.getTotal();
			}
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
