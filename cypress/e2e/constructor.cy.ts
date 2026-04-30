/// <reference types="cypress" />

const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const SAUCE_ID = '643d69a5c3f7b9001cfa0942';

const SELECTORS = {
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]'
};

const INGREDIENT_NAMES = {
  bunTop: 'Краторная булка N-200i (верх)',
  bunBottom: 'Краторная булка N-200i (низ)',
  main: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус Spicy-X'
};

const TEXTS = {
  ingredientDetails: 'Детали ингредиента',
  orderButton: 'Оформить заказ',
  orderNumber: '12345',
  orderIdentifier: 'идентификатор заказа',
  emptyBun: 'Выберите булки',
  emptyIngredient: 'Выберите начинку',
  calories: '4242'
};

const addIngredient = (id: string) => {
  cy.get(`[data-cy=ingredient-add-${id}]`).click();
};

const openIngredientModal = (id: string) => {
  cy.get(`[data-cy=ingredient-card-${id}]`).click();
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку из списка ингредиентов в конструктор', () => {
    addIngredient(BUN_ID);
    addIngredient(MAIN_ID);

    cy.contains(INGREDIENT_NAMES.bunTop).should('exist');
    cy.contains(INGREDIENT_NAMES.bunBottom).should('exist');
    cy.contains(INGREDIENT_NAMES.main).should('exist');
  });

  it('открывает и закрывает модальное окно с данными выбранного ингредиента по крестику', () => {
    openIngredientModal(MAIN_ID);

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).within(() => {
      cy.contains(TEXTS.ingredientDetails).should('exist');
      cy.contains(INGREDIENT_NAMES.main).should('exist');
      cy.contains(TEXTS.calories).should('exist');
    });

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    openIngredientModal(SAUCE_ID);

    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(INGREDIENT_NAMES.sauce).should('exist');

    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('создает заказ, показывает номер заказа и очищает конструктор после закрытия модального окна', () => {
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((window: Window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.reload();
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredient(BUN_ID);
    addIngredient(MAIN_ID);

    cy.contains('button', TEXTS.orderButton).click();
    cy.wait('@createOrder');

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).within(() => {
      cy.contains(TEXTS.orderNumber).should('exist');
      cy.contains(TEXTS.orderIdentifier).should('exist');
    });

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
    cy.contains(TEXTS.emptyBun).should('exist');
    cy.contains(TEXTS.emptyIngredient).should('exist');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((window: Window) => {
      window.localStorage.clear();
    });
  });
});