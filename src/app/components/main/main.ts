import { ElementCreator } from '../../utils/element-creator/element-creator';
// import { Login } from '../login/login';
// import { Registration } from '../registration/registration';

export class Main implements Observer {
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

  async update(data?: string): Promise<void> {
    switch (data) {
      case 'main':
        this.showMain();
        break;
      case 'login':
        await this.showLogin();
        break;
      case 'signup':
        await this.showSignup();
        break;
      default:
        this.show404();
    }
  }

  async showMain(): Promise<void> {
    this.mainView.getElement().textContent = '';
    // TODO add future main context
  }

  async showLogin(): Promise<void> {
    this.mainView.getElement().textContent = '';
    const module = await import('../login/login');
    const login = new module.Login();
    this.mainView.appendNode(login.getElement());
  }

  async showSignup(): Promise<void> {
    this.mainView.getElement().textContent = '';
    const module = await import('../registration/registration');
    const registration = new module.Registration();
    this.mainView.appendNode(registration.getElement());
  }

  async show404(): Promise<void> {
    this.mainView.getElement().textContent = '404';
    // TODO add 404 view
  }
}
