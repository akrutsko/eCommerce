import { ElementButtonCreator } from '../utils/element-creator/element-button-creator';
import { ElementCreator } from '../utils/element-creator/element-creator';

class Header {
  headerView: ElementCreator<HTMLElement>;

  constructor() {
    this.headerView = new ElementCreator({
      tag: 'header',
      classes: 'container',
    });
    this.createView();
  }

  createView(): void {
    const nav = new ElementCreator({ tag: 'nav', classes: 'w-full flex items-center justify-between py-5 gap-8' });
    this.headerView.appendNode(nav);

    const logoSvg = `<svg width="147" height="66" viewBox="0 0 147 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.8 33.03H10.2C12.5 33.03 14.34 33.64 15.72 34.86C17.12 36.08 17.82 37.75 17.82 39.87C17.82 42.07 17.13 43.75 15.75 44.91C14.37 46.05 12.51 46.62 10.17 46.62H5.61V54H1.8V33.03ZM9.72 43.47C12.58 43.47 14.01 42.27 14.01 39.87C14.01 37.41 12.58 36.18 9.72 36.18H5.61V43.47H9.72ZM26.6871 54.45C24.0071 54.45 21.8871 53.78 20.3271 52.44C18.7671 51.1 17.9871 49.23 17.9871 46.83C17.9871 44.47 18.6771 42.6 20.0571 41.22C21.4371 39.84 23.4071 39.15 25.9671 39.15C27.6471 39.15 29.0771 39.47 30.2571 40.11C31.4571 40.75 32.3571 41.63 32.9571 42.75C33.5571 43.85 33.8571 45.11 33.8571 46.53V48.27H21.5871C21.8471 50.41 23.7071 51.48 27.1671 51.48C28.0871 51.48 29.0271 51.4 29.9871 51.24C30.9471 51.08 31.7871 50.86 32.5071 50.58V53.49C31.8271 53.77 30.9471 54 29.8671 54.18C28.8071 54.36 27.7471 54.45 26.6871 54.45ZM30.2871 45.69C30.2471 44.55 29.8371 43.67 29.0571 43.05C28.2971 42.43 27.2471 42.12 25.9071 42.12C24.5871 42.12 23.5471 42.44 22.7871 43.08C22.0271 43.72 21.6271 44.59 21.5871 45.69H30.2871ZM42.1484 54.45C40.4284 54.45 39.0184 54 37.9184 53.1C36.8184 52.18 36.2684 50.95 36.2684 49.41C36.2684 47.81 36.7884 46.56 37.8284 45.66C38.8684 44.76 40.3284 44.31 42.2084 44.31C44.0284 44.31 45.5984 44.68 46.9184 45.42V45.03C46.9184 44.01 46.5984 43.27 45.9584 42.81C45.3384 42.35 44.3284 42.12 42.9284 42.12C42.0484 42.12 41.1784 42.21 40.3184 42.39C39.4584 42.55 38.6984 42.78 38.0384 43.08V40.11C38.6384 39.83 39.4384 39.6 40.4384 39.42C41.4584 39.24 42.4384 39.15 43.3784 39.15C45.8784 39.15 47.7284 39.69 48.9284 40.77C50.1284 41.83 50.7284 43.31 50.7284 45.21V54H47.1584V52.59C46.5384 53.19 45.8284 53.65 45.0284 53.97C44.2484 54.29 43.2884 54.45 42.1484 54.45ZM43.0784 51.69C43.9184 51.69 44.6784 51.53 45.3584 51.21C46.0384 50.87 46.5584 50.41 46.9184 49.83V48.24C45.8184 47.46 44.5584 47.07 43.1384 47.07C41.1184 47.07 40.1084 47.85 40.1084 49.41C40.1084 50.17 40.3584 50.74 40.8584 51.12C41.3784 51.5 42.1184 51.69 43.0784 51.69ZM54.1828 31.83H57.9628V45.93L63.6928 39.6H68.1328L61.7128 46.65L68.8528 54H64.4128L57.9628 47.34V54H54.1828V31.83ZM71.8488 33.03H80.2488C82.5488 33.03 84.3888 33.64 85.7688 34.86C87.1688 36.08 87.8688 37.75 87.8688 39.87C87.8688 42.07 87.1788 43.75 85.7988 44.91C84.4188 46.05 82.5588 46.62 80.2188 46.62H75.6588V54H71.8488V33.03ZM79.7688 43.47C82.6288 43.47 84.0588 42.27 84.0588 39.87C84.0588 37.41 82.6288 36.18 79.7688 36.18H75.6588V43.47H79.7688ZM94.8619 54.45C92.9219 54.45 91.4719 53.93 90.5119 52.89C89.5519 51.83 89.0719 50.43 89.0719 48.69V39.6H92.8519V48.33C92.8519 50.43 93.8319 51.48 95.7919 51.48C96.6519 51.48 97.4619 51.28 98.2219 50.88C98.9819 50.46 99.6219 49.84 100.142 49.02V39.6H103.922V54H100.262V52.05C99.5819 52.87 98.7719 53.48 97.8319 53.88C96.8919 54.26 95.9019 54.45 94.8619 54.45ZM107.532 31.83H111.312V54H107.532V31.83ZM120.525 54.45C119.485 54.45 118.375 54.33 117.195 54.09C116.015 53.85 115.095 53.52 114.435 53.1V49.89C115.215 50.37 116.145 50.76 117.225 51.06C118.305 51.34 119.325 51.48 120.285 51.48C121.245 51.48 121.945 51.4 122.385 51.24C122.825 51.06 123.045 50.74 123.045 50.28C123.045 49.92 122.925 49.63 122.685 49.41C122.465 49.17 122.095 48.96 121.575 48.78C121.075 48.58 120.295 48.34 119.235 48.06C118.035 47.72 117.085 47.37 116.385 47.01C115.705 46.65 115.185 46.2 114.825 45.66C114.485 45.1 114.315 44.38 114.315 43.5C114.315 42.06 114.885 40.98 116.025 40.26C117.165 39.52 118.705 39.15 120.645 39.15C121.645 39.15 122.635 39.25 123.615 39.45C124.615 39.63 125.395 39.89 125.955 40.23V43.32C125.355 42.96 124.625 42.67 123.765 42.45C122.905 42.23 122.025 42.12 121.125 42.12C120.145 42.12 119.405 42.22 118.905 42.42C118.405 42.6 118.155 42.96 118.155 43.5C118.155 43.86 118.285 44.15 118.545 44.37C118.825 44.57 119.185 44.75 119.625 44.91C120.065 45.05 120.865 45.27 122.025 45.57C123.265 45.91 124.235 46.28 124.935 46.68C125.635 47.08 126.135 47.56 126.435 48.12C126.735 48.68 126.885 49.38 126.885 50.22C126.885 51.5 126.335 52.53 125.235 53.31C124.155 54.07 122.585 54.45 120.525 54.45ZM137.986 54.45C135.306 54.45 133.186 53.78 131.626 52.44C130.066 51.1 129.286 49.23 129.286 46.83C129.286 44.47 129.976 42.6 131.356 41.22C132.736 39.84 134.706 39.15 137.266 39.15C138.946 39.15 140.376 39.47 141.556 40.11C142.756 40.75 143.656 41.63 144.256 42.75C144.856 43.85 145.156 45.11 145.156 46.53V48.27H132.886C133.146 50.41 135.006 51.48 138.466 51.48C139.386 51.48 140.326 51.4 141.286 51.24C142.246 51.08 143.086 50.86 143.806 50.58V53.49C143.126 53.77 142.246 54 141.166 54.18C140.106 54.36 139.046 54.45 137.986 54.45ZM141.586 45.69C141.546 44.55 141.136 43.67 140.356 43.05C139.596 42.43 138.546 42.12 137.206 42.12C135.886 42.12 134.846 42.44 134.086 43.08C133.326 43.72 132.926 44.59 132.886 45.69H141.586Z"
      fill="#393E4D" />
    <path
      d="M53 19.7273H59.8534C60.0574 19.7273 60.2409 19.6034 60.3172 19.4142L63.8281 10.7029C63.988 10.3061 64.54 10.2804 64.7362 10.6606L69.0906 19.1013C69.2927 19.4931 69.866 19.4506 70.0082 19.0333L74.9097 4.64972C75.0718 4.17426 75.7551 4.20781 75.8698 4.69685L80.6078 24.9025C80.7068 25.3246 81.2595 25.4293 81.506 25.0725L84.761 20.3612C84.8544 20.2261 85.0082 20.1455 85.1724 20.1455H93"
      stroke="#DB4C43" stroke-width="3" stroke-linecap="round" />
  </svg>`;
    const logo = new ElementCreator({ tag: 'a', html: logoSvg });
    nav.appendNode(logo);

    const mobileMenu = new ElementCreator({ tag: 'div', classes: 'mobile-menu md:w-full md:max-w-full max-w-[390px] hidden justify-between md:flex gap-8' });
    nav.appendNode(mobileMenu);

    const ul = new ElementCreator({ tag: 'ul', classes: 'items-center justify-between flex gap-5' });
    mobileMenu.appendNode(ul);

    const liHome = new ElementCreator({ tag: 'li' });
    ul.appendNode(liHome);

    const aHome = new ElementCreator({ tag: 'a', text: 'Home', classes: 'h4 hover:text-primary-color' });
    aHome.getElement().setAttribute('href', '');
    liHome.appendNode(aHome);

    const liAboutUs = new ElementCreator({ tag: 'li' });
    ul.appendNode(liAboutUs);

    const aAboutUs = new ElementCreator({ tag: 'a', text: 'About us', classes: 'h4 hover:text-primary-color' });
    aAboutUs.getElement().setAttribute('href', '');
    liAboutUs.appendNode(aAboutUs);

    const tab = new ElementCreator({ tag: 'li', classes: 'relative group tab' });
    ul.appendNode(tab);

    const aCategories = new ElementCreator({ tag: 'a', text: 'Categories', classes: 'h4 hover:text-primary-color' });
    aCategories.getElement().setAttribute('href', '');
    tab.appendNode(aCategories);

    const submenu = new ElementCreator({ tag: 'ul', classes: 'submenu absolute hidden bg-white px-2 py-1 w-max' });
    tab.appendNode(submenu);

    const liSummerTime = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liSummerTime);

    const aSummerTime = new ElementCreator({ tag: 'a', classes: 'h5 hover:text-primary-color', text: 'Summer time' });
    aSummerTime.getElement().setAttribute('href', '');
    liSummerTime.appendNode(aSummerTime);

    const liPeakClimber = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liPeakClimber);

    const aPeakClimber = new ElementCreator({ tag: 'a', classes: 'h5 hover:text-primary-color', text: 'Peak climber' });
    aPeakClimber.getElement().setAttribute('href', '');
    liPeakClimber.appendNode(aPeakClimber);

    const liBallGames = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liBallGames);

    const aBallGames = new ElementCreator({ tag: 'a', classes: 'h5 hover:text-primary-color', text: 'Ball games' });
    aBallGames.getElement().setAttribute('href', '');
    liBallGames.appendNode(aBallGames);

    const liIceAdventures = new ElementCreator({ tag: 'li' });
    submenu.appendNode(liIceAdventures);

    const aIceAdventures = new ElementCreator({ tag: 'a', classes: 'h5 hover:text-primary-color', text: 'Ice adventures' });
    aIceAdventures.getElement().setAttribute('href', '');
    liIceAdventures.appendNode(aIceAdventures);

    const divBtns = new ElementCreator({ tag: 'div', classes: 'flex gap-6' });
    mobileMenu.appendNode(divBtns);

    const btnSignUp = new ElementButtonCreator({ tag: 'button', text: 'sign up', classes: 'secondary-button' });
    divBtns.appendNode(btnSignUp);

    const btnLogIn = new ElementButtonCreator({ tag: 'button', text: 'log in', classes: 'primary-button' });
    divBtns.appendNode(btnLogIn);

    const burger = new ElementCreator({ tag: 'div', classes: 'burger space-y-2 z-10 block md:hidden' });
    nav.appendNode(burger);

    const spanBurger1 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger1);
    const spanBurger2 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger2);
    const spanBurger3 = new ElementCreator({ tag: 'span', classes: 'block w-8 h-0.5 bg-secondary-color' });
    burger.appendNode(spanBurger3);

    const bg = new ElementCreator({ tag: 'div', classes: 'bg hidden' });
    nav.appendNode(bg);

    burger.setHandler('click', (): void => {
      mobileMenu.getElement().classList.toggle('active');
      burger.getElement().classList.toggle('active');
      bg.getElement().classList.toggle('active');
      document.body.classList.toggle('active');
    });

    tab.setHandler(
      'click',
      (): void => {
        submenu.addClasses(['active']);
      },
    );

    submenu.setHandler(
      'mouseleave',
      (): void => {
        submenu.getElement().classList.remove('active');
      },
    );
  }

  getView(): ElementCreator<HTMLElement> {
    return this.headerView;
  }

  getElement(): HTMLElement {
    return this.headerView.getElement();
  }
}

export { Header };
