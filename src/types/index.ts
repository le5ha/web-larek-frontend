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
	header?: ViewElement;
	content: ViewElement;
	actions: ViewElement[];
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
	method: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

interface ISuccess {
    total: number;
}