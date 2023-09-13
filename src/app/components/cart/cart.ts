import { LineItem } from '@commercetools/platform-sdk';

import trash from '../../../assets/svg/trash.svg';
import promo from '../../../assets/svg/promo.svg';
import sadCart from '../../../assets/svg/sad-cart.svg';

import { ElementButtonCreator } from '../../utils/element-creator/element-button-creator';
import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { Consumer } from '../consumer/consumer';
import { Store } from '../../enums/store';
import { getPrice } from '../../utils/price/price';
import { addDiscount, deleteCart, removeDiscount, removeFromCart, updateQuantity } from '../../utils/api/api-cart';
import { Message } from '../../utils/message/toastify-message';
import { Confirmation } from '../../utils/confirmation/confirmation';

export class Cart {
  consumer: Consumer;

  cartView: ElementCreator<HTMLElement>;

  constructor(consumer: Consumer) {
    this.consumer = consumer;
    this.cartView = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full flex-1 p-5 md:p-10 relative' });

    if (consumer.cart?.lineItems.length) {
      this.createView();
    } else {
      this.showEmpty();
    }
  }

  createView(): void {
    const title = new ElementCreator({ tag: 'h2', text: 'My shopping cart', classes: 'text-center' });

    const orderContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-4 w-full md:w-fit self-start grow basis-72',
    });
    const options = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-4 rounded-xl p-3 md:p-4 bg-white',
    });
    const optionsTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color text-center', text: 'Options' });
    const orderButton = new ElementButtonCreator({ classes: 'primary-button', text: 'order', disabled: true });

    const firstPartition = new ElementCreator({ tag: 'hr', classes: 'border-none bg-primary-color h-[1px] opacity-10' });
    const secondPartition = new ElementCreator({ tag: 'hr', classes: 'border-none bg-primary-color h-[1px] opacity-10' });

    const subtotalContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between gap-4' });
    const subtotalTitle = new ElementCreator({ tag: 'h5', classes: 'h5 opacity-60', text: 'Subtotal:' });
    const subtotalPrice = new ElementCreator({ tag: 'h5', classes: 'h5 text-primary-color' });
    subtotalContainer.appendNode(subtotalTitle, subtotalPrice);

    const discountContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between gap-4' });
    const discountTitle = new ElementCreator({ tag: 'h5', classes: 'h5 opacity-60', text: 'Discount:' });
    const discountPrice = new ElementCreator({ tag: 'h5', classes: 'h5 text-primary-color' });
    discountContainer.appendNode(discountTitle, discountPrice);

    const totalContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between items-end gap-4' });
    const totalTitle = new ElementCreator({ tag: 'h4', classes: 'h4', text: 'Total amount:' });
    const totalPrice = new ElementCreator({ tag: 'h4', classes: 'h4 text-primary-color' });
    totalContainer.appendNode(totalTitle, totalPrice);

    const setTotal = (): void => {
      if (!this.consumer.cart) return;

      const total = this.consumer.cart.totalPrice;
      const subtotalCents = this.consumer.cart.lineItems.reduce((acc, item) => {
        const price = item.variant.prices?.[0].discounted?.value.centAmount || item.variant.prices?.[0].value.centAmount || 0;
        return acc + price * item.quantity;
      }, 0);

      const subtotal = { ...total };
      subtotal.centAmount = subtotalCents;

      const discount = { ...total };
      discount.centAmount = total.centAmount - subtotal.centAmount;

      if (total) {
        subtotalPrice.setContent(`${getPrice(subtotal)}`);
        discountPrice.setContent(`${getPrice(discount)}`);
        totalPrice.setContent(`${getPrice(total)}`);
      }
    };
    setTotal();

    const cards = new ElementCreator({ tag: 'div', classes: 'flex grow-[9999] flex-col gap-4' });
    this.consumer.cart?.lineItems.forEach((lineItem) => {
      cards.appendNode(this.createProductCard(lineItem, setTotal));
    });

    options.appendNode(
      optionsTitle,
      firstPartition,
      subtotalContainer,
      discountContainer,
      secondPartition,
      totalContainer,
      orderButton,
    );

    const promocodeContainer = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col cursor-pointer items-center gap-4 rounded-xl p-4 bg-white',
    });

    const promocodeTitleContainer = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2' });
    const promocodeSvg = new ElementCreator({ tag: 'div', html: promo });
    const promocodeTitle = new ElementCreator({ tag: 'h4', classes: 'h4', text: 'promocode' });
    promocodeTitleContainer.appendNode(promocodeSvg, promocodeTitle);

    const promocodeFormContainer = new ElementCreator({ tag: 'div', classes: 'flex w-full justify-center items-center gap-2' });
    const promocodeInput = new ElementInputCreator({ classes: 'form-input max-w-sm py-1 px-3' }).getElement();
    const applyButton = new ElementButtonCreator({ classes: 'primary-button py-1', text: 'apply' });
    const discardButton = new ElementButtonCreator({ classes: 'primary-button py-1 hidden', text: 'discard' });
    promocodeFormContainer.appendNode(promocodeInput, applyButton, discardButton);

    promocodeContainer.appendNode(promocodeTitleContainer, promocodeFormContainer);
    orderContainer.appendNode(options, promocodeContainer);

    applyButton.setHandler('click', async () => {
      const code = promocodeInput.value;
      if (!this.consumer.cart || !code) return;

      try {
        this.consumer.cart = (
          await addDiscount(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, code)
        ).body;
        new Message('The discount code is successfully applied.', 'info').showMessage();
        applyButton.addClass('hidden');
        discardButton.removeClass('hidden');
        promocodeInput.disabled = true;
        setTotal();
      } catch (err) {
        if (err instanceof Error) {
          if (err.message) {
            new Message(err.message, 'error').showMessage();
          } else {
            new Message('Something went wrong. Try later.', 'error').showMessage();
          }
        }
      }
    });
    discardButton.setHandler('click', async () => {
      if (!this.consumer.cart) return;

      try {
        this.consumer.cart = (
          await removeDiscount(
            this.consumer.apiClient,
            this.consumer.cart.version,
            this.consumer.cart.id,
            this.consumer.cart.discountCodes[0].discountCode,
          )
        ).body;
        discardButton.addClass('hidden');
        applyButton.removeClass('hidden');
        promocodeInput.value = '';
        promocodeInput.disabled = false;
        setTotal();
      } catch (err) {
        if (err instanceof Error) {
          if (err.message) {
            new Message(err.message, 'error').showMessage();
          } else {
            new Message('Something went wrong. Try later.', 'error').showMessage();
          }
        }
      }
    });

    const content = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-4 justify-between mt-6 md:flex-row md:gap-6 lg:gap-10',
    });
    content.appendNode(cards, orderContainer);

    const clearCart = async (): Promise<void> => {
      if (!this.consumer.cart) return;
      try {
        await deleteCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id);
        this.consumer.cart = null;
        this.showEmpty();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
    };

    const clearButton = new ElementButtonCreator({
      classes: 'secondary-button mt-4 self-start',
      text: 'clear cart',
    }).getElement();
    clearButton.addEventListener('click', async () => {
      clearButton.disabled = true;
      const confirmation = new Confirmation(clearCart);
      confirmation.showConfirmation(
        `Watch out, champ! Clearing your cart is like resetting all your workouts.
        If you're ready to start over, click 'ok'.
        If not, click 'cancel' and let's get back to your shopping training!`,
      );
      clearButton.disabled = false;
    });

    cards.appendNode(clearButton);
    this.cartView.appendNode(title, content);
  }

  showEmpty(): void {
    this.getElement().innerHTML = '';

    const emptyCartContainer = new ElementCreator({
      tag: 'div',
      classes: 'h-full flex flex-col-reverse md:flex-row justify-center items-center gap-8 mt-6',
    });
    const sadCartSvg = new ElementCreator({
      tag: 'div',
      classes: 'drop-shadow-[5px_4px_0px_rgba(219,87,67,0.3)]',
      html: sadCart,
    });
    const emptyCartContent = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-8 max-w-full sm:max-w-2xl items-center',
    });
    const emptyCartText = new ElementCreator({
      tag: 'div',
      classes: 'bg-white p-4 rounded-xl text-justify h4',
      text: "Oops, your cart is as empty as a football field on a rainy day! But don't worry, we've got plenty more sports treasures just waiting to be picked up. In the meantime, give your fingers a workout and start your shopping marathon now! 🏋️‍♀️🛒",
    });
    const emptyCartButton = new ElementAnchorCreator({ href: '/catalog', classes: 'primary-button', text: "let's go shopping" });

    emptyCartContent.appendNode(emptyCartText, emptyCartButton);
    emptyCartContainer.appendNode(sadCartSvg, emptyCartContent);
    this.cartView.appendNode(emptyCartContainer);
  }

  createProductCard(lineItem: LineItem, setTotal: () => void): HTMLElement {
    const card = new ElementCreator({ tag: 'div', classes: 'flex rounded-xl w-full gap-4 p-3 md:p-4 max-h-40 bg-white' });

    const imageContainer = new ElementCreator({
      tag: 'div',
      classes: 'max-w-[6rem] self-start border-2 rounded-lg border-solid border-[#fbedec] p-1 bg-bg-color',
    });
    const image = new ElementImageCreator({
      src: lineItem.variant.images?.[0].url || '',
      alt: '',
      classes: 'w-full h-full object-cover',
    });
    imageContainer.appendNode(image);

    const cartDetails = new ElementCreator({ tag: 'div', classes: 'grow flex flex-col gap-2 justify-between' });
    const firstContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between gap-4' });

    const nameContainer = new ElementCreator({ tag: 'div' });
    const name = new ElementCreator({ tag: 'div', classes: 'h4 text-base product-name', text: lineItem.name[Store.Language] });
    nameContainer.appendNode(name);

    const prices = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-1 items-end' });
    const mainPrice = new ElementCreator({ tag: 'div', classes: 'text-primary-color' });
    const totalPrice = new ElementCreator({ tag: 'div', classes: 'price' });
    prices.appendNode(mainPrice, totalPrice);

    const setPrices = (cardItem = lineItem): void => {
      const price = cardItem.variant.prices?.[0].discounted?.value || cardItem.variant.prices?.[0].value;
      if (price) {
        mainPrice.setContent(`${getPrice(price)}`);

        const money = { ...price };
        money.centAmount *= cardItem.quantity;
        totalPrice.setContent(`${getPrice(money)}`);
      }
    };
    setPrices();

    const secondContainer = new ElementCreator({ tag: 'div', classes: 'flex justify-between gap-4' });

    const deleteButton = new ElementButtonCreator({ html: trash }).getElement();
    deleteButton.addEventListener('click', async () => {
      if (!this.consumer.cart) return;
      deleteButton.disabled = true;
      try {
        this.consumer.cart = (
          await removeFromCart(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, lineItem.id)
        ).body;
        card.getElement().remove();
        setTotal();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
        deleteButton.disabled = false;
      }
      if (!this.consumer.cart.lineItems.length) {
        this.showEmpty();
      }
    });

    firstContainer.appendNode(nameContainer, prices);
    secondContainer.appendNode(this.createCounterCard(lineItem, setPrices, setTotal), deleteButton);
    cartDetails.appendNode(firstContainer, secondContainer);
    card.appendNode(imageContainer, cartDetails);
    return card.getElement();
  }

  createCounterCard(lineItem: LineItem, setPrices: (lineItem?: LineItem) => void, setTotal: () => void): HTMLElement {
    const container = new ElementCreator({ tag: 'div', classes: 'flex items-center gap-2' });
    const minusButton = new ElementButtonCreator({
      classes: 'counter-button',
      text: '–',
      disabled: lineItem.quantity === 1,
    }).getElement();
    const plusButton = new ElementButtonCreator({ classes: 'counter-button', text: '+' }).getElement();
    const counter = new ElementCreator({
      tag: 'span',
      text: `${lineItem.quantity}`,
      classes: 'h5 py-1 px-3 bg-primary-color rounded-lg text-white',
    });
    container.appendNode(minusButton, counter, plusButton);

    let item = this.consumer.cart?.lineItems.find((li) => li.id === lineItem.id);

    const updateCounter = async (quantity: number): Promise<void> => {
      if (!this.consumer.cart || !item) return;

      try {
        this.consumer.cart = (
          await updateQuantity(this.consumer.apiClient, this.consumer.cart.version, this.consumer.cart.id, item.id, quantity)
        ).body;
        item = this.consumer.cart.lineItems.find((li) => li.id === lineItem.id);
        counter.setContent(`${item?.quantity}`);
        setPrices(item);
        setTotal();
      } catch {
        new Message('Something went wrong. Try later.', 'error').showMessage();
      }
    };

    minusButton.addEventListener('click', async () => {
      if (!item) return;

      minusButton.disabled = true;
      await updateCounter(item.quantity - 1);
      minusButton.disabled = item.quantity === 1;
    });

    plusButton.addEventListener('click', async () => {
      if (!item) return;

      plusButton.disabled = true;
      await updateCounter(item.quantity + 1);
      minusButton.disabled = item.quantity === 1;
      plusButton.disabled = false;
    });

    return container.getElement();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.cartView;
  }

  getElement(): HTMLElement {
    return this.cartView.getElement();
  }
}
