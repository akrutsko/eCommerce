import { ElementParams } from '../../types/element-params-type';

export class ElementCreator<T extends HTMLElement> {
  protected element;

  constructor(params: ElementParams) {
    this.element = this.createElement(params);
  }

  private createElement(params: ElementParams): T {
    const element = document.createElement(params.tag);

    if (params.classes) {
      element.className = params.classes;
    }
    if (params.text) {
      element.textContent = params.text;
    }
    if (params.html) {
      element.innerHTML = params.html;
    }
    if (params.id) {
      element.id = params.id;
    }
    return <T>element;
  }

  public addClasses(classes: string[]): this {
    this.element.classList.add(...classes);
    return this;
  }

  public setHandler(eventName: string, handler: EventListener): this {
    this.element.addEventListener(eventName, (event) => handler(event));
    return this;
  }

  public appendNode(node: HTMLElement | ElementCreator<T>): this {
    if (node instanceof HTMLElement) {
      this.element.append(node);
    } else {
      this.element.append(node.getElement());
    }
    return this;
  }

  public getElement(): T {
    return this.element;
  }
}
