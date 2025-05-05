export const languages = [
  { code: "auto", name: "Auto detect" },
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "fr", name: "French" },
];

export const getLanguageName = (code: string): string => {
  const language = languages.find((lang) => lang.code === code);
  return language ? language.name : code;
};
