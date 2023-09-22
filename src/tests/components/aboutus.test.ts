import { AboutUs } from '../../app/components/aboutus/aboutus';

describe('Aboutus component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Aboutus is added to the DOM - getView', () => {
    const about = new AboutUs();
    document.body.append(about.getView().getElement());

    expect(document.querySelector('h1')).toHaveTextContent('Who we are?');
  });

  test('Aboutus is added to the DOM - getElement', () => {
    const about = new AboutUs();
    document.body.append(about.getElement());

    expect(document.querySelector('h1')).toHaveTextContent('Who we are?');
  });
});
