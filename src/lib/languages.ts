export const languages = [
  { code: "auto", name: "Detect language" },
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];

export const getLanguageName = (code: string): string => {
  const language = languages.find((lang) => lang.code === code);
  return language ? language.name : code;
};
