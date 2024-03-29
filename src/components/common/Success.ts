import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { formatNumber } from '../../utils/utils';
import { ISuccess } from '../../types';
import { ISuccessActions } from '../../types';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	setTotal(value: number) {
		this._total.textContent = `Списано ${formatNumber(value)} синапсов`;
	}
}
