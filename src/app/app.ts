import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

export default class App {
  header: Header;

  footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
  }

  init(): void {
    document.body.append(this.header.getElement());
    document.body.append(this.footer.getElement());
  }
}
