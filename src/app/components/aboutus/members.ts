import tab1 from '../../../assets/img/sveta2.png';
import tab2 from '../../../assets/img/aliaksei2.png';
import tab3 from '../../../assets/img/svetik2.png';

import bio1 from '../../../assets/img/svetikBio.png';
import bio2 from '../../../assets/img/aliakseiBio.png';
import bio3 from '../../../assets/img/svetaBio.png';

import { Member } from '../../interfaces/member';

export const contributorsList: Member[] = [
  {
    name: 'sveta',
    img: tab1,
    text: 'Sviatlana is a real engine of the team, she was responsible for setting up and managing the business logic in our project. She was entrusted with the role of analyzing the API and SDK of Commercetools. In addition, Sviatlana actively developed important features of the project. She created catalog sorting and filtering tools, configured routing, implemented lazy loading of products and many other important components. Her work made our project more functional and user-friendly. Sviatlana also brought a positive atmosphere to the team. Her enthusiasm and optimism always lifted the spirits of her colleagues and created a pleasant working atmosphere. Without Sviatlana, our project would not only be less functional, but also less inspiring.',
  },
  {
    name: 'aliaksei',
    img: tab2,
    text: "Aliaksei, our team lead, was an indispensable leader. His role in the project was invaluable. He took care of curating tasks, distributing them on the Kanban board, and setting tasks that each team member was aware of his or her responsibilities. In addition, Alexei was willing to help with any question or task. He was always there to help and advise. His experience and knowledge were a real help to us. Aliaksei also took on the important task of testing the project. He found and fixed API related bugs and other issues. His attention to detail and commitment to perfection ensured the quality of our project. His passion for the project was off the charts. It wasn't uncommon for him to stay up late with it to make sure everything was working flawlessly. Without his dedication and hard work, our store would not be what it is today.",
  },
  {
    name: 'svetik',
    img: tab3,
    text: 'Svitlana was the creative genius of our team, developing a unique store concept. She researched products, determined prices, and created the text content for the website. Her ideas and efforts made our store an exciting place for our customers. She was responsible for the design of the store and took care of the quality of the layout using Tailwind CSS. Svitlana was also responsible for documentation and project management. She created concise call summaries and planning sprints to keep the project moving forward.',
  },
];

export const membersList: Member[] = [
  {
    name: 'Svitlana Moiseienko',
    img: bio1,
    text: {
      bio: 'Svitlana began her journey into the world of web development at the age of 17. Her story started when she accidentally interviewed for an internship in social media management. Once there, she was surprised to learn that they needed a website. Despite her lack of experience in the field, she created her first website in a matter of weeks. This was the beginning of her passion for web development. Svitlana fell so deeply in love with the world of web development that she made the decision to drop out of management school and dedicate herself to learning web development.',
      hobby:
        'Svitlana is a true nomad, constantly on the move and exploring the world without knowing where she will end up tomorrow. In her spare time, she indulges her creative side by writing poetry and playing the ukulele. These hobbies give her a distinct style and creative approach to her work.',
      ultimate: 'Record keeping, Figma master',
    },
    github: 'https://github.com/Luchiweb',
  },
  {
    name: 'Aliaksei Krutsko',
    img: bio2,
    text: {
      bio: '',
      hobby:
        'Alexei enjoys watching TV shows because they tell interesting stories, and playing computer games is a challenge for him to excel at while enjoying online games with his friends.',
      ultimate: 'perfectionist, attention to details, finds bugs where there were none.',
    },
    github: 'https://github.com/akrutsko',
  },
  {
    name: 'Sviatlana Yurusava',
    img: bio3,
    text: {
      bio: "Sviatlana completed her education in the field of Automated Information Processing Systems. She works in the business sector, where she specializes in simplifying and optimizing enterprise processes. This makes them more straightforward and efficient, allowing for better data collection and, ultimately, improved management. She's truly passionate about her work.",
      hobby: 'In her free time, Sviatlana enjoys reading and spending time with friends.',
      ultimate: 'Business logic',
    },
    github: 'https://github.com/Sviatl',
  },
];
