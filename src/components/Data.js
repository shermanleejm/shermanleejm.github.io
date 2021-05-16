export function getProjects() {
  var projects = [
    {
      title: 'SAVVY+',
      description:
        'Finalists for Goldman Sachs and AWS joint hackathon with SMU Elipsis. A one-stop platform that provides youths with easy access to simple yet useful learning resources, an online community of like-minded individuals and engaging tools to track their learning process',
      placeholder: './assets/savvy.jpg',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/BIA-GS-Hackathon',

          title: 'github',
        },
      ],
      hashtags: ['Javascript', 'Python', 'React'],
    },
    {
      title: 'Vueducation',
      description:
        'A hub for students and potential tutors to gather and share answers and post questions related to homework and other interests. Users will be rewarded for their answers and gain more points as they answer more questions with useful answers.',
      placeholder: './assets/vueducation.png',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/vueducation',

          title: 'github',
        },
      ],
      hashtags: ['Nuxt', 'Vue', 'Python', 'Javascript'],
    },
    {
      title: 'Fake Instagram',
      description:
        'Created a fake instagram in order to practice and gain exposure to popular web framework laravel. Users are able to register, upload and view posts similar to the popular social media website, Instagram',
      placeholder: './assets/fakeinstagram.png',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/FakeInstagram',

          title: 'github',
        },
      ],
      hashtags: ['Laravel', 'Vue', 'Javascript'],
    },
    {
      title: 'Social Analytics',
      description:
        'In this project, we set out to determine what students in Singapore were looking for when they were deciding on higher learning institutes. We determined that polytechnic students really depended on the internet for information whereas junior college students still depended on word of mouth. Specific insights may be found in the tableau dashboard below.',
      placeholder: './assets/socialanalytics.png',
      buttons: [
        {
          href:
            'https://public.tableau.com/views/IS434UniversityAnalysis_new/IS434UniversitySentiments?:language=en-GB&:display_count=y&:origin=viz_share_link',

          title: 'Tableau',
        },
        {
          href: 'https://github.com/shermanleejm/Social_Analytics',

          title: 'Github',
        },
      ],
      hashtags: ['Python', 'Web scraping', 'Data Analytics', 'Tableau', 'Back-end'],
    },
    {
      title: 'eMsika e-commerce website',
      description:
        "Collaborated with Zambian company eMsika to help develop their own e-commerce website. Utilised mainly laravel and livewire. This project was started as the company did not have access to their original website's source code.",
      placeholder: '',
      buttons: [
        {
          href: 'https://www.emsika.com',

          title: 'website',
        },
      ],
      hashtags: ['Laravel', 'Livewire', 'Javascript'],
    },
    {
      title: 'Expenditure Tracker',
      description:
        'My personal pet project that helps you record your daily expenditure with some visualisations provided. I am actively working on this project and any feedback would be greatly appreciated.',
      placeholder: '',
      buttons: [
        {
          href: 'https://shrmn-money-tracker.s3-ap-southeast-1.amazonaws.com/index.html',
          title: 'DOWNLOAD',
        },
        {
          href: 'https://github.com/shermanleejm/expenditure-tracker',
          title: 'GITHUB',
        },
      ],
      hashtags: ['React', 'Javascript', 'AWS', 'Front-end', 'IndexedDB'],
    },

    {
      title: 'Bidding System',
      description:
        'For this school project, we were tasked with creating a bidding system that we managed to get an A- (not that good but still a crowning personal achievement). This was the first time I had ever made a working web application that could be deployed and accessed on the internet. This was supposed to be a replica of the existing BOSS bidding system that SMU students use. The project was made using PHP and Bootstrap.',
      placeholder: '',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/Merlion_bidding',

          title: 'Github',
        },
      ],
      hashtags: ['PHP', 'Front-end', 'Back-end'],
    },
    {
      title: 'Social Magnet',
      description:
        'In this school project, we made a social media application that was heavily influenced by popular social media sites running purely in the command line.',
      placeholder: '',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/social_magnet',
          title: 'GITHUB',
        },
      ],
      hashtags: ['Java', 'MySQL'],
    },
    {
      title: 'APTOS Blindness Test',
      description:
        'For this project I attempted the APTOS blindess machine learning project on Kaggle to try and determine if a particular image of an eyeball was experiencing or going to experience blindness and managed to get a good test accuracy.',
      placeholder: '',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/APTOS_blindness_test',

          title: 'Github',
        },
      ],
      hashtags: ['Python', 'Tensorflow', 'Data Analytics', 'Machine Learning', 'Neural Network'],
    },
    {
      title: 'News Article Scraper',
      description:
        'In this pet project of mine, I created my own wec scraper and summariser that would take the newest Top articles from CNA and summarise it into a set number of sentences. I am still working on a JS version of this python application.',
      placeholder: '',
      buttons: [
        {
          href: 'https://github.com/shermanleejm/News-Scraper-and-Summarizer',

          title: 'Github',
        },
      ],
      hashtags: ['Python', 'Web scraping', 'Back-end'],
    },
  ];
  return projects;
}

