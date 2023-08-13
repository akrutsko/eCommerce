import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Router } from './router/router';

export default class App {
  header: Header;

  footer: Footer;

  router: Router;

  constructor() {
    this.router = new Router();
    this.header = new Header(this.router);
    this.footer = new Footer();

    this.router.addObserver(this.header);
  }

  init(): void {
    document.body.append(this.header.getElement());
    document.body.append(this.footer.getElement());
  }
}
