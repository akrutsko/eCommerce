import { Modal } from '../../app/components/modal/modal';

describe('Modal component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Modal is added to the DOM - getView', () => {
    const modal = new Modal();
    document.body.append(modal.getView().getElement());

    expect(document.querySelector('dialog')).toBeInTheDocument();
  });
  test('Modal is added to the DOM - getElement', () => {
    const modal = new Modal();
    document.body.append(modal.getElement());

    expect(document.querySelector('dialog')).toBeInTheDocument();
  });
});
