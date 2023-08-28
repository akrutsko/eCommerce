import { routes } from './routes';

export class Router implements Observable {
  private observers: Observer[] = [];

  private previousPath = '';

  private previousHash = '';

  constructor() {
    window.onpopstate = this.handleLocation;
  }

  subscribe(observer: Observer): void {
    if (this.observers.includes(observer)) return;
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) return;
    this.observers.slice(index, 1);
  }

  notify(primaryData?: string, secondaryData?: string, search?: string): void {
    if (primaryData) {
      this.observers.forEach((observer) => observer.update(primaryData, secondaryData, search));
    }
  }

  public handleLocation = (): void => {
    const newPath = window.location.pathname;
    const newHash = window.location.hash.substring(1);
    const { search } = window.location;
    if (newPath === this.previousPath && newHash === this.previousHash) {
      return;
    }
    this.previousPath = newPath;
    this.previousHash = newHash;
    const route = routes[newPath] || routes[404];
    this.notify(route, newHash, search);
  };
}
