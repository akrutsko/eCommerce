import { ElementCreator } from '../../utils/element-creator/element-creator';
import { Login } from '../login/login';
import { Registration } from '../registration/registration';

export class Main implements Observer {
  mainView: ElementCreator<HTMLElement>;

  login: Login;

  registration: Registration;

  constructor() {
    this.mainView = new ElementCreator({
      tag: 'main',
      classes: 'container flex flex-col justify-center items-center h-full my-5 md:my-10',
      text: 'main',
    });
    this.login = new Login();
    this.mainView.appendNode(this.login.loginView);
    this.login.loginView.addClass('hidden');
    this.registration = new Registration();
    this.mainView.appendNode(this.registration.registrationView);
    this.registration.registrationView.addClass('hidden');
  }

  getView(): ElementCreator<HTMLElement> {
    return this.mainView;
  }

  getElement(): HTMLElement {
    return this.mainView.getElement();
  }

  update(data?: string): void {
    switch (data) {
      case 'main':
        this.login.loginView.addClass('hidden');
        this.registration.registrationView.addClass('hidden');
        break;
      case 'login':
        this.registration.registrationView.addClass('hidden');
        this.login.loginView.removeClass('hidden');
        break;
      case 'signup':
        this.registration.registrationView.removeClass('hidden');
        this.login.loginView.addClass('hidden');
        break;
      default:
        this.login.loginView.addClass('hidden');
        this.registration.registrationView.addClass('hidden');
    }
  }
}
