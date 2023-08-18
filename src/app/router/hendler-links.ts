import { Router } from './router';

export class HendlerLinks {
  router: Router;

  listOfLinks: HTMLAnchorElement[] = [];

  constructor(router: Router) {
    this.router = router;
  }

  handleLinks(): void {
    this.listOfLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.currentTarget instanceof HTMLAnchorElement) {
          e.preventDefault();
          window.history.pushState({}, '', e.currentTarget.href);
          this.router.handleLocation();
        }
      });
    });
  }
}
