import './scss/styles.scss';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { Page } from './components/Page';
import { AppData, ProductItem } from './components/AppData';
import { IProduct, IOrder, IOrderForm } from './types';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Cart } from './components/common/Cart';
import { OrderForm } from './components/OrderForm';
import { PersonalForm } from './components/ContactsForm';
import { Success } from './components/common/Success';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// инстансы классов
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const page = new Page(document.body, events);
const appData = new AppData(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Cart(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new PersonalForm(cloneTemplate(contactsTemplate), events);
// слушатели 
// создаем карточки товаров
events.on<IProduct>('items:show', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			id: item.id,
		});
	});
});
// 
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});
// при добавлении товара закидываем его в данные приложения и обновляем счетчик корзины
events.on('product:order', (item: ProductItem) => {
	appData.addToCart(item);
	page.counter = appData.basket.length;
});
// в превью показываем инфу у о товаре
events.on('preview:show', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				events.emit('product:order', item);
				modal.close();
			},
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
				id: item.id,
			}),
		});
	};

	if (item) {
		api
			.getProductInfo(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});
// обновляем данные в корзине, когда открываем ее
events.on('basket:open', () => {
	basket.items = appData.basket.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			id: item.id,
		});
	});
	basket.total = appData.getTotal();
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});
// удаляем товар из корзины, данных приложения и счетчика корзины
events.on('card:delete', (item: ProductItem) => {
	appData.deleteFromCart(item);
	page.counter = appData.basket.length;
	events.emit('basket:open');
});
// валидация форм 
events.on(
	'formErrors:change',
	({ payment, address, email, phone }: Partial<IOrder>) => {
		order.valid = !payment && !address;
		contacts.valid = !email && !phone;
		order.errors = Object.values({ payment, address })
			.filter((i) => !!i)
			.join('; ');
		contacts.errors = Object.values({ payment, phone })
			.filter((i) => !!i)
			.join('; ');
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value, false);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value, true);
	}
);
// рендер формы заказа
events.on('order:open', () => {
	console.log('order:open event received');
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});
// форма заполения контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});
// заказ продуктов и отрисовка успешного окна заказа
events.on('contacts:submit', () => {
	appData.order.total = appData.getTotal();
	api
		.orderProducts(appData.order)
		.then((res) => {
			try {
				const success = new Success(cloneTemplate(successTemplate), {
					onClick: () => {
						console.log('contacts:submit');
						modal.close();
					},
				});
				success.setTotal(appData.getTotal());
				modal.render({
					content: success.render({}),
				});
			} catch (err) {
				console.error(err);
			}
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
// установка каталога товаров
api
	.getProductList()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((err) => {
		console.error(err);
	});
