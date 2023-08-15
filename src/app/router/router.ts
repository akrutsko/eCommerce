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

  private routes: Record<string, string> = {
    404: '404',
    '/': 'main',
    '/main': 'main',
    '/login': 'login',
    '/signup': 'signup',
    '/signout': 'signout',
    '/aboutus': 'aboutus',
    '/categories': 'categories',
  };

  public handleLocation = (): void => {
    const path = window.location.pathname;
    let primaryPath = '/';
    let secondaryPath = '';
    if (path !== '/') {
      const parts = path.split('/').filter((part) => part !== '');

      if (parts.length >= 1) {
        primaryPath = `/${parts[0]}`;
      }

      if (parts.length >= 2) {
        secondaryPath = `/${parts.slice(1).join('/')}`;
      }
    }
    const route = this.routes[primaryPath] || this.routes[404];
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
