import './aboutus.css';

import member1 from '../../../assets/img/svetik1.png';
import member2 from '../../../assets/img/aliaksei1.png';
import member3 from '../../../assets/img/sveta1.png';
import rs from '../../../assets/img/rs-logo.png';
import circus from '../../../assets/img/circus.png';

import { ElementCreator } from '../../utils/element-creator/element-creator';
import { ElementImageCreator } from '../../utils/element-creator/element-image-creator';
import { ElementInputCreator } from '../../utils/element-creator/element-input-creator';
import { ElementLabelCreator } from '../../utils/element-creator/element-label-creator';
import { contributorsList, membersList } from './members';
import { Member } from '../../interfaces/member';
import { ElementAnchorCreator } from '../../utils/element-creator/element-anchor-creator';
import { MemberModal } from '../modal/member-modal';

export class AboutUs {
  aboutUsView: ElementCreator<HTMLElement>;

  constructor() {
    this.aboutUsView = new ElementCreator({ tag: 'div', classes: 'w-full flex flex-col gap-12' });
    this.createView();
  }

  createView(): void {
    const heading = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] text-center rounded-xl w-full px-5 py-10 md:py-14' });
    const headingTeamName = new ElementCreator({ tag: 'h4', classes: 'opacity-60 h4', text: 'CodeCircus' });
    const headingTitle = new ElementCreator({ tag: 'h1', text: 'Who we are?' });
    const headingSubtitle = new ElementCreator({
      tag: 'h5',
      classes: 'opacity-60 h5',
      text: "and why you'll want to bring us on board",
    });
    heading.appendNode(headingTeamName, headingTitle, headingSubtitle);

    const members = new ElementCreator({ tag: 'div', classes: 'overflow-hidden md:overflow-visible' });
    const membersTitle = new ElementCreator({ tag: 'h2', classes: 'text-center mb-8', text: 'Our members' });
    const membersContent = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col md:flex-row justify-between gap-8 2xl:justify-center 2xl:gap-16',
    });

    const firstMember = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-2 items-center transition-transform duration-500 cursor-pointer member',
    });

    const firstMemberImageContainer = new ElementCreator({
      tag: 'div',
      classes: 'circle rounded-full w-fit max-w-xs md:max-w-sm transition-colors bg-zinc-100 p-6',
    });
    firstMemberImageContainer.appendNode(new ElementImageCreator({ src: member1, alt: '' }));

    const firstMemberDescription = new ElementCreator({ tag: 'div', classes: 'text-center' });
    firstMemberDescription.appendNode(
      new ElementCreator({ tag: 'h3', text: 'Developer' }),
      new ElementCreator({ tag: 'h4', classes: 'h4', text: 'Svitlana Moiseienko' }),
    );

    firstMember.appendNode(firstMemberImageContainer, firstMemberDescription);

    firstMember.setHandler('click', () => {
      const modal = new MemberModal(membersList[0]);
      document.body.append(modal.getElement());
      modal.showModal();
    });

    const secondMember = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col order-first md:order-none gap-2 items-center scale-[1.1] cursor-pointer',
    });

    const secondMemberImageContainer = new ElementCreator({
      tag: 'div',
      classes: 'rounded-full w-fit max-w-xs md:max-w-sm bg-[#FFE7E3] p-6',
    });
    secondMemberImageContainer.appendNode(new ElementImageCreator({ src: member2, alt: '' }));

    const secondMemberDescription = new ElementCreator({ tag: 'div', classes: 'text-center' });
    secondMemberDescription.appendNode(
      new ElementCreator({ tag: 'h3', classes: 'text-primary-color', text: 'Team Lead' }),
      new ElementCreator({ tag: 'h4', classes: 'h4 text-primary-color', text: 'Aliaksei Krutsko' }),
    );

    secondMember.appendNode(secondMemberImageContainer, secondMemberDescription);
    secondMember.setHandler('click', () => {
      const modal = new MemberModal(membersList[1]);
      document.body.append(modal.getElement());
      modal.showModal();
    });

    const thirdMember = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col gap-2 items-center transition-transform duration-500 cursor-pointer member',
    });

    const thirdMemberImageContainer = new ElementCreator({
      tag: 'div',
      classes: 'circle rounded-full w-fit max-w-xs md:max-w-sm transition-colors bg-zinc-100 p-6',
    });
    thirdMemberImageContainer.appendNode(new ElementImageCreator({ src: member3, alt: '' }));

    const thirdMemberDescription = new ElementCreator({ tag: 'div', classes: 'text-center' });
    thirdMemberDescription.appendNode(
      new ElementCreator({ tag: 'h3', text: 'Developer' }),
      new ElementCreator({ tag: 'h4', classes: 'h4', text: 'Sviatlana Yurusava' }),
    );

    thirdMember.appendNode(thirdMemberImageContainer, thirdMemberDescription);
    thirdMember.setHandler('click', () => {
      const modal = new MemberModal(membersList[2]);
      document.body.append(modal.getElement());
      modal.showModal();
    });

    membersContent.appendNode(firstMember, secondMember, thirdMember);
    members.appendNode(membersTitle, membersContent);

    const aboutTeam = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] rounded-xl w-full p-5 md:p-10' });
    const aboutTeamTitle = new ElementCreator({ tag: 'h2', classes: 'text-center mb-4', text: 'About team' });

    const aboutTeamContent = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col justify-between md:flex-row gap-4 items-center',
    });
    const aboutTeamText = new ElementCreator({ tag: 'div', classes: 'flex flex-wrap gap-2' });
    const aboutTeamFirstP = new ElementCreator({
      tag: 'p',
      classes: 'text-opacity-60',
      text: 'We are a team of skilled programmers and creative minds dedicated to producing innovative and original products. Our work combines technical expertise and imagination. We value not only technical skills, but also creativity and flexibility in our work. This philosophy helps us think outside the box and generate fresh and exciting ideas.',
    });
    const aboutTeamSecondP = new ElementCreator({
      tag: 'p',
      classes: 'text-opacity-60',
      text: 'Our commitment to excellence is the cornerstone of everything we do. We constantly hone our skills and strive to create software that exceeds expectations, regardless of the complexity of the project.',
    });
    aboutTeamText.appendNode(aboutTeamFirstP, aboutTeamSecondP);

    const aboutTeamSticker = new ElementCreator({
      tag: 'div',
      classes: 'w-[20px] md:w-full md:min-w-[150px] md:max-w-[250px]',
    }).appendNode(new ElementImageCreator({ src: circus, alt: 'sticker' }));

    aboutTeamContent.appendNode(aboutTeamText, aboutTeamSticker);
    aboutTeam.appendNode(aboutTeamTitle, aboutTeamContent);

    const contribution = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });
    const contributionTitle = new ElementCreator({ tag: 'h2', classes: 'text-center', text: 'Project contribution' });

    const tabs = new ElementCreator({ tag: 'ul', classes: 'w-full flex justify-between items-center gap-16' });
    const contributionContent = new ElementCreator({
      tag: 'div',
      classes: 'bg-[#F1EFEF] p-6 mt-2 rounded-xl',
      text: 'We value the contributions and unique skills of each member and believe that the diversity of our talents makes us stronger. Everyone plays a key role in creating our software masterpieces. We strive to create an environment where everyone can realize their potential and contribute to common goals. We encourage ideas and initiatives, respect different points of view, and listen carefully to everyone. Mutual respect and trust are the foundation of our team, and we take pride in the way we work together to create something amazing.',
    });

    contributorsList.forEach((member) => tabs.appendNode(this.createTab(member, contributionContent.getElement())));

    contribution.appendNode(contributionTitle, tabs, contributionContent);

    const aboutCourse = new ElementCreator({ tag: 'div', classes: 'bg-[#F1EFEF] p-6 rounded-lg' });
    const aboutCourseTitle = new ElementCreator({ tag: 'h2', classes: 'text-center mb-4', text: 'About course' });
    const aboutCourseContent = new ElementCreator({
      tag: 'div',
      classes: 'flex flex-col-reverse md:flex-row items-center gap-6',
    });
    const aboutCourseText = new ElementCreator({ tag: 'div', classes: 'flex flex-col gap-4' });

    const rsLogo = new ElementAnchorCreator({ href: 'https://rs.school/', classes: 'w-full max-w-[8rem] md:max-w-xs' });
    rsLogo.appendNode(new ElementImageCreator({ src: rs, alt: 'rs-logo' }));

    const aboutCourseFirstP = new ElementCreator({
      tag: 'p',
      classes: 'text-opacity-60',
      text: 'This project was created as part of the final assignment for the "JavaScript/Frontend" course at RS School. RS School is an educational initiative that strives to make the process of learning web development interesting and accessible to everyone.',
    });
    const aboutCourseSecondP = new ElementCreator({
      tag: 'p',
      classes: 'text-opacity-60',
      text: 'We highly recommend the RS School course to anyone interested in web development. This course provides high quality learning material, practical assignments and support from experienced developers. It is ideal for both beginners and those who want to improve their skills in this area',
    });
    const aboutCourseThirdP = new ElementCreator({
      tag: 'p',
      classes: 'text-opacity-60',
      text: 'If you also want to start your journey in the world of web development, we strongly encourage you to visit the official website of RS School and join the training.',
    });

    aboutCourseText.appendNode(aboutCourseFirstP, aboutCourseSecondP, aboutCourseThirdP);
    aboutCourseContent.appendNode(rsLogo, aboutCourseText);
    aboutCourse.appendNode(aboutCourseTitle, aboutCourseContent);

    const message = new ElementCreator({
      tag: 'h4',
      classes: 'text-center text-primary-color',
      text: "If you are looking for a team of developers who can bring your concepts to life, look no further. We're here to help you every step of the way and create something truly extraordinary.",
    });

    this.aboutUsView.appendNode(heading, members, aboutTeam, contribution, aboutCourse, message);
  }

  createTab(member: Member, content: HTMLElement): HTMLElement {
    const tab = new ElementCreator({ tag: 'li' });
    const tabInput = new ElementInputCreator({
      type: 'radio',
      classes: 'sr-only tab-input',
      name: 'tab',
      id: member.name,
    });
    const tabLabel = new ElementLabelCreator({
      for: member.name,
      classes: 'block max-w-xs cursor-pointer rounded-full p-4',
    });

    tabLabel.appendNode(new ElementImageCreator({ src: member.img, alt: `${member.name}` }));

    tab.setHandler('click', () => {
      const contentField = content;
      if (typeof member.text === 'string') {
        contentField.innerText = member.text;
      }

      const inputs = this.getElement().querySelectorAll('input');
      inputs.forEach((input) => input.nextElementSibling?.classList.toggle('bg-zinc-100', input.checked));
    });

    tab.appendNode(tabInput, tabLabel);
    return tab.getElement();
  }

  getView(): ElementCreator<HTMLElement> {
    return this.aboutUsView;
  }

  getElement(): HTMLElement {
    return this.aboutUsView.getElement();
  }
}
