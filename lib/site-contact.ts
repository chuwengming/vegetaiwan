export const CONTACT_PHONE = "0952415738";
export const CONTACT_EMAIL = "vegetaiwan99@gmail.com";

export const SOCIAL_LINKS = {
  facebook: {
    label: "Facebook",
    href: "https://www.facebook.com/21DayVeganFun",
    ariaLabel: "Facebook 官方粉絲頁",
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/21DayVeganFun",
    ariaLabel: "Instagram 官方帳號",
  },
  youtube: {
    label: "YouTube",
    href: "https://www.youtube.com/@vegetaiwan-vtpa-21DayVeganFun",
    ariaLabel: "YouTube 官方頻道",
  },
} as const;

export const SOCIAL_LINK_LIST = [
  SOCIAL_LINKS.facebook,
  SOCIAL_LINKS.instagram,
  SOCIAL_LINKS.youtube,
] as const;
