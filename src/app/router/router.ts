export class Router {
  private observers: Observer[] = [];

  constructor() {
    window.onpopstate = this.handleLocation;
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  private notifyObservers(data: string): void {
    for (let i = 0; i < this.observers.length; i += 1) {
      this.observers[i].update(data);
    }
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
    window.history.pushState({}, '', (myEvent.target as HTMLAnchorElement).href);
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
