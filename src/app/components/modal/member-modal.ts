import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { Modal } from './modal';
import { Member } from '../../interfaces/member';

export class MemberModal extends Modal {
  member: Member;

  constructor(member: Member) {
    super();
    this.member = member;
    this.setView();
  }

  setView(): void {
    if (typeof this.member.text === 'string') return;
    const container = new ElementCreator({ tag: 'div', classes: 'p-4 flex flex-col md:flex-row gap-6' });

    const imageContainer = new ElementCreator({
      tag: 'div',
      classes: 'max-w-[10rem] md:max-w-xs rounded-full self-center overflow-hidden',
    });
    imageContainer.appendNode(new ElementImageCreator({ src: this.member.img, alt: '' }));

    const info = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4 basis-full' });

    const bioContainer = new ElementCreator({ tag: 'div' });
    const bioTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Short biography' });
    const bio = new ElementCreator({ tag: 'div', classes: 'text-secondary-color', text: this.member.text.bio });
    bioContainer.appendNode(bioTitle, bio);

    const hobbyContainer = new ElementCreator({ tag: 'div' });
    const hobbyTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Hobby' });
    const hobby = new ElementCreator({ tag: 'div', classes: 'text-secondary-color', text: this.member.text.hobby });
    hobbyContainer.appendNode(hobbyTitle, hobby);

    const utilityContainer = new ElementCreator({ tag: 'div' });
    const utilityTitle = new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Ultimate' });
    const utility = new ElementCreator({ tag: 'div', classes: 'text-secondary-color', text: this.member.text.ultimate });
    utilityContainer.appendNode(utilityTitle, utility);

    info.appendNode(bioContainer, hobbyContainer, utilityContainer);
    container.appendNode(imageContainer, info);

    this.getView().appendNode(container);
  }
}
