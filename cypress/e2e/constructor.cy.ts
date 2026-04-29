/// <reference types="cypress" />

const bunId = '643d69a5c3f7b9001cfa093c';
const mainId = '643d69a5c3f7b9001cfa0941';
const sauceId = '643d69a5c3f7b9001cfa0942';

const addIngredient = (id: string) => {
  cy.get(`[data-cy=ingredient-add-${id}]`).click();
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
    addIngredient(bunId);
    addIngredient(mainId);

    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('открывает и закрывает модальное окно с данными выбранного ингредиента по крестику', () => {
    cy.get(`[data-cy=ingredient-card-${mainId}]`).click();

    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal]').within(() => {
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('4242').should('exist');
    });

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.get(`[data-cy=ingredient-card-${sauceId}]`).click();

    cy.get('[data-cy=modal]').should('be.visible');
    cy.contains('Соус Spicy-X').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('создает заказ, показывает номер заказа и очищает конструктор после закрытия модального окна', () => {
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.reload();
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredient(bunId);
    addIngredient(mainId);

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal]').within(() => {
      cy.contains('12345').should('exist');
      cy.contains('идентификатор заказа').should('exist');
    });

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((window) => {
      window.localStorage.clear();
    });
  });
});
