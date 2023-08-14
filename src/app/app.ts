import { Consumer } from './components/consumer/consumer';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

export default class App {
  header: Header;

  footer: Footer;

  consumer: Consumer;

  constructor() {
    this.consumer = new Consumer();
    this.header = new Header(this.consumer);
    this.footer = new Footer();
  }

  init(): void {
    document.body.append(this.header.getElement());
    document.body.append(this.footer.getElement());

    this.consumer.subscribe(this.header);
    this.consumer.init();
  }
}
