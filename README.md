# Project "Web Larёk" (from russian Larёk - kiosk/Späti )

Stack: HTML, SCSS, TS, Webpack

Project structure:
- src/ — project source files
- src/components/ — folder with JS components
- src/components/base/ — base code folder

Important files:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Installation and launch
To install and run the project you need to run the commands

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Building the project

```
npm run build
```

или

```
yarn build
```

## Architecture
![Project architecture diagram](./src/images/architectures_schema.png)

## Base code
### 1. Class EventEmitter
Implements the “Observer” pattern and allows you to subscribe to events and notify subscribers about the occurrence of an event.
The class has methods `on`, `off`, `emit` - for subscribing to an event, unsubscribing from an event and notifying subscribers about the occurrence of an event, respectively.
Additionally, the `onAll` and `offAll` methods have been implemented - for subscribing to all events and resetting all subscribers.

События, обрабатываемые классом `EventEmitter`
- `basket:open` - запускает callback, который запрашивает у класса AppStatus актуальное состояние корзины, с помощью Modal.render() выводит на экран попап с содежимым корзины; на кнопку Оформить вешается слушатель клика, запускающий событие `ordersDelivery:open`, на кнопку закрытия попапа (крестик) вешается слушатель клика, по которому попап закрывается;
- `basket:changed` - запускает callback, который запрашивает у класса AppStatus список товаров в корзине; далее, если такого товара в корзине нет, то добавляет этот товар, увеличивает количество товара в корзине (счетчик) и общую стоимость корзины (`total`); далее, на кнопку удаления каждого из добавленных товаров устанавливается слушатель клика, который, в свою очередь запускает метод удаления товара из корзины и обновляет общую стоимость корзины;
- `cards:changed` - запускает callback, который формирует карточки товаров (`Card`); на каждую из карточек устанавливается обработчик события `card:select`;
- `card:select` - запускает callback, вызывающий метод `setPreview`, который, в свою очередь, запускает обработчик событие `preview:changed`;
- `preview:changed` - запускает callback, который берет id карточки, запрашивает по нему всю информацию о выбранном товаре, формирует превью и с помощью Modal.render() выводит на экран попап с выбранным товаром; на кнопку добавления товара в корзину вешается слушатель клика, который в свою очередь, запускает событие `basket:changed`;
- `ordersDelivery:open` - запускает callback, который с помощью Modal.render() и данных класса OrdersDelivery формирует и отображает модальное окно с формой ввода адреса доставки и выбора способа оплаты; на кнопки выбора способа оплаты вешается слушатель, запускающий событие `paymentMethod:changed`, которое, в свою очередь, запписывает выбранный способ оплаты в `AppStatus.order.payment`, на поле ввода вешается слушатель события ввода с клавиатуры, который запускает событие `ordersDelivery:changed`; на кнопку закрытия (крестик) вешается слушатель, который закрывает модальное окно и очищается форму ввода адреса доставки и выбранный способ оплаты;
- `ordersDelivery:changed` - запускает callback, который записывает данные в `AppStatus.order.address`, а так же валидирует поля ввода с помощью метода `checkOredersDeliveryValidation()`; на кнопку Далее вешается слушатель сабмита формы, запускающий событие `ordersContacts:open` в случае, если валидация поля прошла успешно;
- `ordersContacts:open` - запускает callback, который с помощью Modal.render() и данных класса OrdersContacts формирует и отображает модальное окно с формой ввода телефона и адреса электронной почты; на поля ввода вешается слушатель события ввода с клавиатуры, запускающий событие `ordersContacts:changed`; на кнопку закрытия попапа устанавливается слушатель события клика, который закрывает модальное окно, очищая при этом поля ввода формы контактов и формы доставки;
- `ordersContacts:changed` - запускает callback, который который записывает введенные данные в `AppStatus.order.phone` и `AppStatus.order.email`, а так же валидирует поля ввода данных с помощью метода `checkOredersContactsValidation()`; в случае успешной валидации кнопка Оплатить становится активной и на нее устанавливется слушатель события `order:submit`;
- `order:submit` - запускает callback, отправляющий сформированный объект заказа на сервер и, получив ответ об успешном оформлении заказа, очищает корзину и все формы заказа, сбрасывает состояние выбора способа оплаты и далее запускает событие `success:open`;
- `success:open` - запускает callback, который с помощью Modal.render() и данных класса Success отображает на экране попап с информирование об успешном оформлении заказа.

#### 2. Class Api
This class works with basic requests to the server (GET, POST, PUT, DELETE) and processes responses received from the server.
The class has methods:
`get` and `post` - for executing requests to the server,
`handleRespons` - for processing the server response, parsing it and handling errors.

### 3. Class Component
The base class, which is inherited by all components - page, cart, product cards, modal windows. Purpose - creating HTML elements and managing their properties.

The class includes methods:
`toggleClass` - to toggle the class of a specific DOM element,
`setText` - to set the text to the textContent property of a specific DOM element,
`setDisabled` - to “disable” the passed DOM element,
`setHidden` - to hide a specific DOM element,
`setVisible` - to show a specific DOM element,
`setImage` - to set the image (src) and alternative text (alt) for a specific DOM element,
`render` - for generating a component and “rendering” it in the markup.

### 4. Class Model
A base class designed to create model data used to manage application data. Directly “communicates” with EventEmitter, taking model data and the `events` argument into the constructor.

Includes only one method:
`emitChanges` - to notify all subscribers that the model has changed.

## Data Model Components
### 1. Class AppStatus
Class for storing the current state of the application: data about the product, cart, preview, order and errors.
Inherited from Model (`Model<IAppStatus>`).

Class methods:
- `clearBasket` ​​- to clear the basket data,
- `addItemToBasket` ​​- to add a specific item to the cart,
- `deleteItemFromBasket` ​​- to delete a specific item from the cart,
- `setCards` - for drawing the product catalog,
- `setPreview` - to open a product preview,
- `setOrderDelivery` - to set order delivery data,
- `setOrdersContacts` - to set contact data,
- `checkOrdersValidation` - for validating the order form.

## Presentation Components
Designed...
Hypothetical classes:
_class Basket - basket,
_class Card - product card,
_class Form - order form (input fields, form validation, submission),
_class Modal - a universal modal window,
_class Success - displays an information message about a successful purchase,
_Page class - for displaying page elements, for example, product cards, carts, etc.
## Key data types
