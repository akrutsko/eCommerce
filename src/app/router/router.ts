import { routes } from './routes';

export class Router implements Observable {
  private observers: Observer[] = [];

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

  notify(primaryData?: string, secondaryData?: string): void {
    if (primaryData) {
      this.observers.forEach((observer) => observer.update(primaryData, secondaryData));
    }
  }

  public handleLocation = (): void => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const hashValue = window.location.hash;
    this.notify(route, hashValue);
  };

  public navigateToLogin(): void {
    window.history.pushState({}, '', '/login');
    this.handleLocation();
  }

  public navigateToSignUp(): void {
    window.history.pushState({}, '', '/signup');
    this.handleLocation();
  }

  public navigateToSignOut(): void {
    window.history.pushState({}, '', '/signout');
    this.handleLocation();
  }
}
