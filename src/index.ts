import './scss/styles.scss';

import { AppStatus, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { OrdersDelivery, paymentMethod } from './components/OrdersDelivery';
import { OrdersContacts } from './components/OrdersContacts';
import { Success } from './components/Success';
import { ICard, IOrdersContacts, IOrdersDelivery } from './types';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// All templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const ordersDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const ordersContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Application data model
const appStatus = new AppStatus({}, events);

// Global containers
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const ordersDelivery = new OrdersDelivery(cloneTemplate(ordersDeliveryTemplate), events, {
  onClick: (event: Event) => {
    events.emit('payment:changed', event.target)
  }
});
const ordersContacts = new OrdersContacts(cloneTemplate(ordersContactsTemplate), events);

// Catalog items have changed
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appStatus.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    });
  });
});

//Product selection
events.on('card:select', (item: ICard) => {
  appStatus.setPreview(item);
});

//Opening a popup with a preview
events.on('preview:changed', (item: ICard) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('item:check', item);
      card.buttonText = appStatus.basket.indexOf(item) < 0 ? 
      'Add to cart' : 
      'Remove from cart';
    }
  })

  modal.render({
    content: card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      buttonText: appStatus.basket.indexOf(item) < 0 ?
      'Add to cart' : 
      'Remove from cart',
    })
  })
});

//Checking whether an item is in the cart
events.on('item:check', (item: ICard) => {
  (appStatus.basket.indexOf(item) < 0) ?
  events.emit('item:add', item) :
  events.emit('item:delete', item);
});

//Adding a product to an order
events.on('item:add', (item: ICard) => {
  appStatus.addItemToBasket(item);
})

//Removing a product from an order
events.on('item:delete', (item: ICard) => {
  appStatus.deleteItemFromBasket(item);
})

//Changing order and counter status
events.on('basket:changed', (items: ICard[]) => {
  basket.items = items.map((item, count) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {events.emit('item:delete', item)}
    });
    return card.render({
      title: item.title,
      price: item.price,
      count: (count++).toString(),
    });
  });
  let total = 0;
  items.forEach(item => {
    total = total + item.price;
  });
  basket.total = total;
  appStatus.order.total = total;
});

//Changing the counter
events.on('count:changed', () => {
  page.counter = appStatus.basket.length;
});

//Opening the cart
events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  });
});

//Opening the delivery form
events.on('order:open', () => {
  modal.render({
    content: ordersDelivery.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    })
  });
  appStatus.order.items = appStatus.basket.map((item) => item.id);
});

//Changing your payment method
events.on('payment:changed', (target: HTMLElement) => {
  if(!target.classList.contains('button_alt-active')) {
    ordersDelivery.changeButtonsClasses();
    appStatus.order.payment = paymentMethod[target.getAttribute('name')];
  };
});

//Changes to the address input field
events.on(/^order\..*:change/, (data: { field: keyof IOrdersDelivery, value: string }) => {
  appStatus.setOrdersDelivery(data.field, data.value);
});

//Validation of the address entry form
events.on('deliveryForm:changed', (errors: Partial<IOrdersDelivery>) => {
  const { payment, address } = errors;
  ordersDelivery.valid = !payment && !address;
  ordersDelivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

//Delivery form validation completed
events.on('ordersDelivery:changed' , () => {
  ordersDelivery.valid = true;
});

//Delivery form submission
events.on('order:submit', () => {
  modal.render({
    content: ordersContacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    })
  });
  appStatus.order.items = appStatus.basket.map((item) => item.id);
});

//Changes to contact input fields
events.on(/^contacts\..*:change/, (data: {field: keyof IOrdersContacts, value: string}) => {
  appStatus.setOrdersContacts(data.field, data.value)
})

//Validation of the contact entry form
events.on('contactsForm:changed', (errors: Partial<IOrdersContacts>) => {
  const { email, phone } = errors;
  ordersContacts.valid = !email && !phone;
  ordersContacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

//Contact form validation completed
events.on('ordersContacts:changed' , () => {
  ordersContacts.valid = true;
});

//Contact form validation completed
events.on('contacts:submit', () => {
  api.orderProducts(appStatus.order)
  .then(result => {
    appStatus.clearBasket();
    const success = new Success(cloneTemplate(successTemplate), {
      onClick: () => {
        modal.close();
      }
    });
    console.log(result);
    success.total = result.total.toString();
    modal.render({
        content: success.render({})
      });
    })
  .catch(error => {
    console.error(error);
  });
});

// Block page scrolling if a modal is open
events.on('modal:open', () => {
  page.locked = true;
});

// ... and unlock it
events.on('modal:close', () => {
  page.locked = false;
});

//Getting a list of cards
api.getCardsList()
	.then(appStatus.setCards.bind(appStatus))
	.catch((err) => {
		console.error(err);
});