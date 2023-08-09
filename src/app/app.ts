import { Footer } from './components/footer/footer';

export default class App {
  footer: Footer;

  constructor() {
    this.footer = new Footer();
  }

  init(): void {
    document.body.append(this.footer.getElement());
  }
}
