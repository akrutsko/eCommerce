export class Router implements Observable {
  private observers: Observer[] = [];

  private previousPath = '';

  constructor() {
    window.addEventListener('popstate', () => this.handleLocation());
    document.body.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement && event.target.host === window.location.host) {
        event.preventDefault();
        window.history.pushState({}, '', event.target.href);
        this.handleLocation();
      }
    });
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

  notify(rootRout: string, pathRoutes: string[]): void {
    this.observers.forEach((observer) => observer.update(rootRout, pathRoutes));
  }

  public handleLocation(): void {
    const newPath = window.location.pathname;
    if (newPath === this.previousPath) return;
    this.previousPath = newPath;

    const [rootRoute, ...pathRoutes] = newPath.slice(1).split('/');
    this.notify(rootRoute, pathRoutes);
  }
}
