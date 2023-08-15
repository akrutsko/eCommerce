import { Consumer } from './components/consumer/consumer';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Main } from './components/main/main';
import { Router } from './router/router';

export default class App {
  header: Header;

  main: Main;

  footer: Footer;

  consumer: Consumer;

  router: Router;

  constructor() {
    this.router = new Router();
    this.consumer = new Consumer();
    this.header = new Header(this.consumer);
    this.main = new Main();
    this.footer = new Footer();

    this.router.subscribe(this.main);
    this.router.handleLocation();
  }

  init(): void {
    document.body.append(this.header.getElement());
    document.body.append(this.main.getElement());
    document.body.append(this.footer.getElement());

    this.consumer.subscribe(this.header);
    this.consumer.init();
  }
}
