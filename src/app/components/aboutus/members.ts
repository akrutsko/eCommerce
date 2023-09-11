import tab1 from '../../../assets/img/sveta2.png';
import tab2 from '../../../assets/img/aliaksei2.png';
import tab3 from '../../../assets/img/svetik2.png';

import bio1 from '../../../assets/img/svetikBio.png';
import bio2 from '../../../assets/img/aliakseiBio.png';
import bio3 from '../../../assets/img/svetaBio.png';

import { Member } from '../../interfaces/member';

export const contributorsList: Member[] = [
  { name: 'sveta', img: tab1, text: '1' },
  { name: 'aliaksei', img: tab2, text: '2' },
  { name: 'svetik', img: tab3, text: '3' },
];

export const membersList: Member[] = [
  {
    name: 'Svitlana Moiseienko',
    img: bio1,
    text: {
      bio: 'Svitlana began her journey into the world of web development at the age of 17. Her story started when she accidentally interviewed for an internship in social media management. Once there, she was surprised to learn that they needed a website. Despite her lack of experience in the field, she created her first website in a matter of weeks. This was the beginning of her passion for web development. Svitlana fell so deeply in love with the world of web development that she made the decision to drop out of management school and dedicate herself to learning web development. She is constantly absorbing new knowledge and seeking new challenges.',
      hobby:
        'Svitlana is a true nomad, constantly on the move and exploring the world without knowing where she will end up tomorrow. Her lifestyle inspires her and gives her a unique perspective on design and development. In her spare time, she indulges her creative side by writing poetry and playing the ukulele. These hobbies give her a distinct style and creative approach to her work.',
      ultimate: 'Record keeping, Figma master',
    },
  },
  { name: 'Aliaksei Krutsko', img: bio2, text: { bio: '', hobby: '', ultimate: '' } },
  { name: 'Sviatlana Yurusava', img: bio3, text: { bio: '', hobby: '', ultimate: '' } },
];
