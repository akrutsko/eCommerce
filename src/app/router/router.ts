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

  splitPath(path: string): { primaryPath: string; secondaryPath: string } {
    const hashIndex = path.indexOf('#');
    let primaryPath = '/';
    let secondaryPath = '';

    if (hashIndex !== -1) {
      primaryPath = path.substring(0, hashIndex);
      secondaryPath = path.substring(hashIndex);
    } else {
      primaryPath = path;
    }

    return { primaryPath, secondaryPath };
  }

  public handleLocation = (): void => {
    const path = window.location.pathname;
    const { primaryPath, secondaryPath } = this.splitPath(path);
    const route = routes[primaryPath] || routes[404];
    this.notify(route, secondaryPath);
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
