export class Router {
  private observers: Observer[] = [];

  constructor() {
    window.onpopstate = this.handleLocation;
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  private notifyObservers(data: string): void {
    this.observers.forEach((observer) => {
      observer.update(data);
    });
  }

  private routes: Record<string, string> = {
    404: '404',
    '/': 'main',
    '/main': 'main',
    '/login': 'login',
    '/signup': 'signup',
  };

  public handleLocation = async (): Promise<void> => {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes[404];
    this.notifyObservers(route);
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
