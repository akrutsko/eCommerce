import { ElementParams } from '../types/element-params-type';
import { ElementCreator } from '../utils/element-creator/element-creator';

class Header extends ElementCreator<HTMLDivElement> {
  public navElementHome: ElementCreator<HTMLDivElement>;

  constructor() {
    const params: ElementParams = { tag: 'div' };
    super(params);
    this.navElementHome = new ElementCreator(params);
  }
}

export { Header };
