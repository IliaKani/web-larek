import './scss/styles.scss';

import { AppStatus, CardItem, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')

// Модель данных приложения
const appStatus = new AppStatus({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appStatus.cards.map(item => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    })
  })
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});



//Получение списка карточек
api.getCardsList()
	.then(appStatus.setCards.bind(appStatus))
	.catch((err) => {
		console.error(err);
});