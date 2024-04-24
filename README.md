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

### 2. Class Api
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