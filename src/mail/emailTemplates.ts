export const emailTemplates = {
  invitation: {
    en: ({ companyName, link }) => `
      <h3>You've been invited to join ${companyName}</h3>
      <p>Click below to accept your invitation:</p>
      <a href="${link}">Accept Invitation</a>
    `,
    fr: ({ companyName, link }) => `
      <h3>Vous avez été invité à rejoindre ${companyName}</h3>
      <p>Cliquez ci-dessous pour accepter votre invitation:</p>
      <a href="${link}">Accepter l'invitation</a>
    `,
    ar: ({ companyName, link }) => `
      <h3>دعوة للانضمام إلى ${companyName}</h3>
      <p>اضغط هنا للانضمام:</p>
      <a href="${link}">قبول الدعوة</a>
    `,
  },
};
