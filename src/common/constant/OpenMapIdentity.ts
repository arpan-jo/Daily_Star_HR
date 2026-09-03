export const getRequestIdentity = () => {
  const identities = [
    {
      referer: 'https://app.peopledesk.io',
      userAgent: 'PeopleDeskMobile/0.0.1',
    },
    {
      referer: 'https://uttara.peopledesk.io',
      userAgent: 'UttaraPeopleDesk/0.0.2',
    },
    {
      referer: 'https://ifarmer.peopledesk.io',
      userAgent: 'IFarmerPeopleDesk/0.0.3',
    },
    {
      referer: 'https://justiceandcarebd.peopledesk.io',
      userAgent: 'JusticeCarePeopleDesk/0.0.4',
    },
    {
      referer: 'https://bylc.peopledesk.io',
      userAgent: 'BYLCPeopleDesk/0.0.5',
    },
    {
      referer: 'https://disa.peopledesk.io',
      userAgent: 'DISAPeopleDesk/6',
    },
    {
      referer: 'https://hrm.akijgroup.com',
      userAgent: 'AkijHRM/0.0.7',
    },
  ];

  return identities[Math.floor(Math.random() * identities.length)];
};
