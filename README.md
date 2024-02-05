# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура
> Может быть изменена в ходе реализации
> Реализована по примеру проекта "Оно тебе надо"
### Базовый слой
#### Класс ```EventEmitter```
Класс для сохранения событий:
 - установка и снятие слушателей,
 - вызов слушателей при возникновении события.
```
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};
```
```
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;

	emit<T extends object>(event: string, data?: T): void;

	trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

#### Класс ```API```
Интерфейс для работы с API:
 - отправка GET запросов,
 - отправка POST запросов.
 ```
 export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
 ```

#### Класс ```Component```
Базовый класс компонента:
 - установка и снятие классов элементов,
 - добавление текста в элемент,
 - изменение активности элемента,
 - возврат DOM-элементов.


#### Класс ```Model```
Базовая модель, чтобы можно было отличить ее от простых объектов с данными.

### Модель данных
#### Класс ```Page```
Отображение элементов на странице:
 - каталог,
 - счетчик товаров в корзине.
 ```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

#### Класс ```OrderForm```
Интерфейс карточки заказа:
 - отображение способа оплаты и метода доставки.
 ```
 export interface IOrderForm {
	email: string;
	phone: string;
}
```
####  Класс ```PersonalForm```
Интерфейс работы с модалкой перс. данных:
 - email, номер телефона.


### Представление
#### Класс ```Modal```
Интерфейс модального окна:
 - открывть и закрывать модалки,
 - слушать события.
 ```
 export interface IModal {
	header?: ViewElement;
	content: ViewElement;
	actions: ViewElement[];
}
```

 #### Класс ```Cart```
 Интерфейс модалки корзины:
  - добавление товаров,
  - удаление товаров.
```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```

#### Класс ```Success```
Интерфейс модалки успешного заказа:
 - сумма заказа.
 ```
 interface ISuccess {
    total: number;
}
```




