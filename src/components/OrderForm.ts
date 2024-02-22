import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class OrderForm extends Form<Pick<IOrderForm, 'payment' | 'address'>> {
	protected _methodButtons: HTMLButtonElement[];
	protected methodPayment: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._methodButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._methodButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.selectMethodPayment(btn);
				this.onInputChange('payment', btn.name);
			});
		});
	}

	selectMethodPayment(button: HTMLButtonElement) {
		this._methodButtons.forEach((btn) => {
			btn.classList.remove('button_alt-active');
		});
		button.classList.add('button_alt-active');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
