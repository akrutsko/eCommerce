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
    text: 'Sviatlana is a true driving force behind our team. She was responsible for establishing and managing the business logic in our project, and she was entrusted with the task of analyzing Commercetools API and SDK. Additionally, Sviatlana actively developed critical features for the project. She created catalog sorting and filtering tools, configured routing, implemented lazy loading of products, and many other essential components. Her contributions significantly enhanced the functionality and user-friendliness of our project. Sviatlana also infused the team with a positive atmosphere. Her enthusiasm and optimism consistently boosted the morale of her colleagues, creating a pleasant work environment. Without Sviatlana, our project would not only be less functional but also less inspiring.',
  },
  {
    name: 'aliaksei',
    img: tab2,
    text: "Aliaksei, our team lead, was an indispensable leader. Aliaksei's contribution to the project was invaluable. He not only efficiently coordinated the team's efforts but also motivated us to achieve outstanding results. One of his primary responsibilities as a team leader was task management. He create methods for communicating with the API and the development of functionality such as consumer flow, authorization tokens, shopping cart creation, and management, among others. He also testing our project and resolving bugs related to the API and other aspects. Aliaksei was always willing to tackle the most challenging tasks, and his passion for the project inspired the entire team. It's no wonder he occasionally worked late on the project. Without his dedication, talent, and leadership, our store wouldn't exist in its current form. Aliaksei was and continues to be an irreplaceable leader of our team.",
  },
  {
    name: 'svetik',
    img: tab3,
    text: "Svitlana was the creative genius of our team, responsible for developing a unique store concept. She conducted product research, determined pricing, and crafted the textual content for the website. Her ideas and efforts transformed our store into an exciting destination for customers. Svitlana took charge of the store's design and ensured high-quality layout using Tailwind CSS. She also handled documentation and project management, creating concise meeting summaries and sprint plans to keep the project on track.",
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
      bio: 'Aliaksei started his journey with computers from childhood. After finishing school, he entered university to specialize in "Economic Informatics", but eventually graduated with a degree in "Economics and Business Management". After university, Aliaksei worked for a year in his specialty and then for two years as a customs declarant. However, his passion for IT led him to a testing course organized by EPAM. In 2005, his passion for IT led to his first job in this field. For 17 years Aliaksei has been actively developing in IT, starting as a Junior Software Testing Engineer and reaching the position of Lead Software Testing Engineer. During his career he also held the roles of Scrum Master, QA Lead and Team Lead. But then Aliaksei decided to change his primary skill set and started studying automation. During this process he got in touch with JavaScript and continued his education at RS School.',
      hobby:
        'Aliaksei enjoys watching TV shows because they tell interesting stories, and playing computer games is a challenge for him to excel at while enjoying online games with his friends.',
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
