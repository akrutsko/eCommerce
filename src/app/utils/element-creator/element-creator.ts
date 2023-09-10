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

  public addClass(className: string): this {
    this.element.classList.add(className);
    return this;
  }

  public removeClass(className: string): this {
    this.element.classList.remove(className);
    return this;
  }

  public toggleClass(className: string): this {
    this.element.classList.toggle(className);
    return this;
  }

  public setHandler(eventName: string, handler: EventListener): this {
    this.element.addEventListener(eventName, (event) => handler(event));
    return this;
  }

  public setContent(content: string): this {
    this.element.textContent = content;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/array-type
  public appendNode(...nodes: Array<HTMLElement | ElementCreator<HTMLElement>>): this {
    nodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        this.element.append(node);
      } else {
        this.element.append(node.getElement());
      }
    });
    return this;
  }

  public getElement(): T {
    return this.element;
  }
}
