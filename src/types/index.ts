export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: ProductCategory;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}


export interface IGetItems {
    getItemsList: () => Promise<IProduct[]>
    getItemsInfo: (id: string) => Promise<IProduct>
}

export interface IModal {
	content:HTMLElement[];
}

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}


export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export interface IContactsForm {
	email: string;
	phone: string;
}

interface ISuccess {
    total: number;
}
export interface ILarekApi {
    getProductList: () => Promise<IProduct[]>;
    getProductInfo: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

// переписать
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;