import { ElementCreator } from '../../utils/element-creator/element-creator';

export class Main implements Observer {
  mainView: HTMLElement;

  constructor() {
    this.mainView = new ElementCreator({
      tag: 'main',
      classes: 'container flex flex-col justify-center items-center h-full my-5 md:my-10',
      text: 'main',
    }).getElement();
  }

  getView(): HTMLElement {
    return this.mainView;
  }

  async update(data?: string): Promise<void> {
    this.mainView.textContent = '';
    switch (data) {
      case 'main':
        this.showMain();
        break;
      case 'login':
        this.showLogin();
        break;
      case 'signup':
        this.showSignup();
        break;
      default:
        this.show404();
    }
  }

  showMain(): void {
    // TODO add future main context
  }

  async showLogin(): Promise<void> {
    const { Login } = await import('../login/login');
    this.mainView.append(new Login().getElement());
  }

  async showSignup(): Promise<void> {
    const { Registration } = await import('../registration/registration');
    this.mainView.append(new Registration().getElement());
  }

  show404(): void {
    this.mainView.textContent = '404';
    // TODO add 404 view
  }
}
