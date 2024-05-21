# Project "Web Larёk" (from russian Larёk - kiosk/Späti )

Stack: HTML, SCSS, TS, Webpack
API: https://larek-api.nomoreparties.co
Due to the fact that the server data is in Russian, an API (deepl) was used to translate the data. Therefore, there is a slight delay before the cards appear.

Project structure:
- src/ — project source files
- src/components/ — folder with JS components
- src/components/base/ — base code folder

Important files:
- src/pages/index.html — HTML-file of main page
- src/types/index.ts — types file
- src/index.ts — application entry point
- src/styles/styles.scss — root style file
- src/utils/constants.ts — file with constants
- src/utils/utils.ts — utility file

## Installation and launch
To install and run the project you need to run the commands

```
npm install
npm run start
```

or

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

Events processed by the `EventEmitter` class
- `items:changed` - runs a callback that generates product cards (`Card`); a `card:select` event handler is installed on each card;
- `card:select` - runs a callback that calls the `setPreview` method, which, in turn, launches the `preview:changed` event handler;
- `preview:changed` - runs a callback that takes the card id, requests all the information about the selected product, generates a preview and, using Modal.render(), displays a popup with the selected product; a click listener is attached to the add-to-cart button, which in turn fires the `item:check` event;
- `item:check` - checks whether there is such an item in the cart, if there is no such item, then the `item:add` event is fired, which adds the item to the order object, otherwise, if such an item exists, the `item' event is fired: delete`, which removes an item from the cart;
- `order:open` - launches a callback, which, using Modal.render() and data from the OrdersDelivery class, generates and displays a modal window with a form for entering the delivery address and selecting a payment method; a listener is attached to the buttons for selecting a payment method, triggering the `payment:changed` event, which, in turn, writes the selected payment method to `AppStatus.order.payment`; a listener for the keyboard input event is attached to the input field, which triggers the `ordersDelivery event :changed`; a listener is attached to the close button (cross), which closes the modal window and clears the form for entering the delivery address and the selected payment method;
- `basket:open` - launches a callback that requests the current status of the basket from the AppStatus class, using Modal.render() to display a popup with the contents of the basket; a click listener is attached to the Checkout button, which triggers the `ordersDelivery:open` event, a click listener is attached to the popup close button (a cross), which closes the popup;
- `basket:changed` - runs a callback that requests the AppStatus class for a list of products in the basket; further, if there is no such product in the cart, then it adds this product, increases the quantity of goods in the cart (`count:changed`) and the total cost of the cart (`total`); further, a click listener is installed on the delete button for each of the added products, which, in turn, launches the method for removing the product from the cart and updates the total cost of the cart;
- `ordersDelivery:changed` - runs a callback that writes data to `AppStatus.order.address`, and also validates input fields using the `checkOredersDeliveryValidation()` method; a form submission listener is attached to the Next button, triggering the `order:submit` event if the field validation was successful;
- `order:submit` - launches a callback, which, using Modal.render() and data from the OrdersContacts class, generates and displays a modal window with a form for entering a phone number and email address; a keyboard input event listener is attached to the input fields, triggering the `ordersContacts:changed` event; a click event listener is installed on the popup's close button, which closes the modal window, while clearing the input fields of the contact form and delivery form;
- `ordersContacts:changed` - runs a callback, which writes the entered data to `AppStatus.order.phone` and `AppStatus.order.email`, and also validates the data entry fields using the `checkOredersContactsValidation()` method; in case of successful validation, the Pay button becomes active and a `contacts:submit` event listener is installed on it;
- `contacts:submit` - runs a callback that sends the generated order object to the server and, having received a response about the successful completion of the order, clears the cart and all order forms, resets the payment method selection state and then fires the `success:open` event;
- `modal:open` - blocks content on the page under the modal window;
- `modal:close` - unlocks content on the page under the modal window.

### 2. Api class
This class works with basic requests to the server (GET, POST, PUT, DELETE) and processes responses received from the server.
The class has methods:
- `get` and `post` - to perform requests to the server,
- `handleRespons` - for processing the server response, parsing it and handling errors.

### 3. Component class
The base class, which is inherited by all classes responsible for rendering the interface on the screen. Provides methods to descendant classes to manipulate markup.

The class includes methods:
- `toggleClass` - to toggle the class of a specific DOM element,
- `setText` - to set the text to the textContent property of a specific DOM element,
- `setDisabled` - to “disable” the passed DOM element,
- `setHidden` - to hide a specific DOM element,
- `setVisible` - to show a specific DOM element,
- `setImage` - to set an image (src) and alternative text (alt) for a specific DOM element,
- `render` - returns container, from which markup elements are drawn using the `replaceChildren` method.

### 4. Model class
A base class designed to create model data used to manage application data. Directly “communicates” with EventEmitter, taking model data and the `events` argument into the constructor.

Includes only one method:
- `emitChanges` - to notify all subscribers that the model has changed.

## Data model components
### 1. AppStatus class
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

## View Components
Hypothetical classes:
- class Basket - basket, inherited from Component (`Component<IBasket>`)
- Card class - product card, inherited from Component (`Component<ICard>`)
- OrderDelivery class - displays and manages the delivery data entry form, inherits from Component (`Component<IOrderDelivery>`)
- OrdersContacts class - displays and manages the contact data entry form, inherits from Component (`Component<IOrdersContacts>`)
- Modal class - a universal modal window, inherited from Component (`Component<IModal>`)
- Success class - displays an information message about a successful purchase, inherited from Component (`Component<ISuccess>`)
- Page class - collects a cart with a counter and products onto the main page. inherits from Component (`Component<IPage>`)