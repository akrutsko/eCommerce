import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Main {
  mainView: ElementCreator<HTMLElement>;

  constructor() {
    this.mainView = new ElementCreator({
      tag: 'main',
      classes: 'container flex flex-col justify-center items-center h-full my-5 md:my-10',
      text: 'main',
    });
  }

  getView(): ElementCreator<HTMLElement> {
    return this.mainView;
  }

  getElement(): HTMLElement {
    return this.mainView.getElement();
  }
}
