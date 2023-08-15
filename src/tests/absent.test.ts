import { Absent } from '../app/components/absent/absent';

describe('Absent component', () => {
  test('Absent is added to the DOM', () => {
    const notFound = new Absent();
    document.body.append(notFound.getElement());

    expect(document.querySelector('div')).toBeInTheDocument();
  });
});
