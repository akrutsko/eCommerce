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
    '/catagories': 'catagories',
  };

  public handleLocation = async (): Promise<void> => {
    const path = window.location.pathname;
    const parts = path.split('/').filter((part) => part !== '');
    let primaryPath = '';
    let secondaryPath = '';

    if (parts.length >= 1) {
      primaryPath = `/${parts[0]}`;
    }

    if (parts.length >= 2) {
      secondaryPath = `/${parts.slice(1).join('/')}`;
    }
    const route = this.routes[primaryPath] || this.routes[404];
    this.notify(route, secondaryPath);
  };

  public route = (event: Event): void => {
    const myEvent = event || window.event;
    myEvent.preventDefault();
    if (myEvent.target instanceof HTMLAnchorElement) {
      window.history.pushState({}, '', myEvent.target.href);
    }
    this.handleLocation();
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
