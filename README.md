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
> Сделана по примеру проекта "Оно тебе надо" и сделана по схеме MVC
### Базовый слой
#### Класс ```EventEmitter```
Класс для сохранения событий:
 - установка и снятие слушателей,
 - вызов слушателей при возникновении события.
 Реализует паттерн Observer и использует механизм подписки.
 Экземпляр класса имеет свойства:
```
_events: Map<EventName
```
```
 Set<Subscriber>>
```
Методы класса:
 - **on** – устанавливает обработчик на событие;
 - **onAll** – устанавливает обработчик на все события;
 - **off** – снимает обработчик с события
 - **ofAll** – устанавливает обработчик на все события;
 - **emit** – инициирует события с данными
 - **trigger** – делает коллбек триггер, генерирующий событие при вызове
 
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

 Реализует паттерн Фасад.

 Все методы возвращают промисы:
  - **protected handleResponse** - возвращает JSON при успешном ответе. При неуспешном ответе возвращает ошибку;
  - **get** - служит для GET-запросов и использует **protected handleResponse**;
  - **post** - служит для POST-запросов и использует **protected handleResponse**;
 ```
 export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
 ```

#### Класс ```Component```
Базовый класс компонента для управления элментами DOM:
 - установка и снятие классов элементов,
 - добавление текста в элемент,
 - изменение активности элемента,
 - возврат DOM-элементов.

 Реализует паттерн Компоновщик.

 Экземпляр класса имеет свойство ```container: HTMLElement```
 Методы класса:
  - **setText** – устанавливает текст в элемент;
  - **setDisabled** - меняет статус блокировки элемента;
  - **setImage** – устанавливает изображение и альтернативный текст;
  - **render** - возвращает элемент.

### Модель данных
#### Класс ```AppData```
Содержит состояние данных страницы.
Имеет методы:
 - **setCatalog** - устанавливает каталог;
 - **setPreview** - устанавливает данные для превью товара;
 - **addToCart** - добавляет товары в корзину;
 - ***deleteFromCart** - удаляет товары из корзины;
 - **getTotat** - возвращает информацию об общей стоимости товаров;
 - **getCartItems** - возвращает состав корзины;
 - **clearCart** - очищает корзину;
 - **setOrderField** - сохраняет полученные данные из формы;
 - **setOrderItems** - устанавливает данные заказа;
 - **validateOrder** - проверяет корректность заказа.

### Представление```

#### Класс ```Card```
Интерфейс карточки товара:
 - отрисовывает товар на странице.

 Наследует ```Component``` и использует интерфейс ```IProduct```:
```
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: ProductCategory;
}
```
Имеет поля типа ```HTMLElement``` и методы, которые устанавливают значения в поля:
 - **set id**;
 - **set title**;
 - **set image**;
 - **set description**;
 - **set category**;
 - **set price**;
 - **setDeleteButton**;
 - **render** - возвращает карточку.

 #### Класс ```Page```
Отображение элементов на странице:
 - каталог,
 - счетчик товаров в корзине.

Имеет поля типа ```HTMLElement```.
Методы класса:
 - **set counter** – устанавливает счетчик элементов в корзине;
 - **set locked** - блокирует страничку;
 - **set catalog** - отображает каталог товаров.

 Наследуется от класса ```Component``` и реализует интерфейс ```IPage```.
 ```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

#### Класс ```Modal```
Интерфейс модального окна:
 - открывть и закрывать модалки,
 - слушать события.

 Наследует ```Component``` и использует интерфейс ```IModal``` (исправлено):
 ```
export interface IModal {
	content:HTMLElement[];
}
```
Имеет поля типа ```HTMLElement``` и методы:
 - ***open*** - открывает модалку;
 - **close** - закрывает модалку;
 - **set content** - добавляет контент в модалку;
 - **render** - возвращает модалку.
 
 В модалке реализовано сохранение позиции скролла пользователя для улучшения UX при просмотре карточек товаров.

 #### Класс ```Cart```
 Интерфейс модалки корзины:
  - добавление товаров,
  - удаление товаров.
Наследует ```Component``` и реализует интерфейс ```IBasketView```:
```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```
Все поля класса имеют тип ```HTMLElement```.
Методы класса:
 - ***set items*** – устанавливает элементы в корзину;
 - **set total** - устанавливает общую стоимость или отображает "Корзина пуста".

 #### Класс ```Form```
Базовый класс форм наследует ```Component``` и использует интерфейс IFormState. 
 ```
interface IFormState {
    valid: boolean;
    errors: string[];
}
 ```
Все поля имеют класса имеют тип ```HTMLElement``` и методы:
 - **set valid**,
 - **set errors**,
 - **render**.


#### Класс ```OrderForm```
Интерфейс карточки заказа:
 - отображение способа оплаты и метода доставки.
 Наследует ```Form``` и использует интерфейс IOrderForm:
 ```
export interface IOrderForm {
	method: string;
	address: string;
}
```
Методы:
 - **selectMethodPaymen**,
 - **set adress**.
####  Класс ```PersonalForm```
Интерфейс перс данных:
 - отображение email и метода доставки.
 Наследует ```Form``` и использует интерфейс IContactsForm:
 ```
export interface IContactsForm {
	email: string;
	phone: string;
}
```
Методы:
 - **set phone**,
 - **set email**.
#### Класс ```Success```
Интерфейс модалки успешного заказа:
 - сумма заказа.

Наследует ```Component``` и реализует интерфейс ```ISuccess```.
 ```
 interface ISuccess {
    total: number;
}
```
```
export interface ISuccessActions {
	onClick: () => void;
} 
```



#### Класс ```LarekAPI```
Служебный класс, который отвечает за взаимодействие с API. 
Реализует интерфейс ```IGetItems```.
```
interface IGetItems {
    getItemsList: () => Promise<IProduct[]>
    getItemsInfo: (id: string) => Promise<IProduct>
}
```
```
export interface IOrderResult {
	id: string;
	total: number;
}
``` 
Методы класса:
 - **getItemList** - получение списка товаров;
 - **getItemInfo** - получение информации о товаре с сервера;
 - **orderProducts** - отправка заказа.






