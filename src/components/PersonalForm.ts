import { Form } from './common/Form';
import { IContactsForm } from '../types';
import { IEvents } from './base/events';

export class PersonalForm extends Form<Pick<IContactsForm, 'email' | 'phone'>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
