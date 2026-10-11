import type { Category } from "@/types/product";

export const categories: Category[] = [
  {
    slug: "eyeglasses",
    image: "/images/categories/eyeglasses.jpg",
    imageAlt: {
      en: "Person adjusting dark-framed eyeglasses",
      mr: "गडद फ्रेमचा चष्मा सावरणारी व्यक्ती",
      hi: "गहरे फ़्रेम का चश्मा ठीक करता व्यक्ति",
    },
  },
  {
    slug: "sunglasses",
    image: "/images/categories/sunglasses.jpg",
    imageAlt: {
      en: "Smiling woman wearing green-framed sunglasses",
      mr: "हिरव्या फ्रेमचा सनग्लास घातलेली हसरी स्त्री",
      hi: "हरे फ़्रेम का सनग्लास पहने मुस्कुराती महिला",
    },
  },
  {
    slug: "kids",
    image: "/images/categories/kids.jpg",
    imageAlt: {
      en: "Young child wearing round eyeglasses",
      mr: "गोल चष्मा घातलेले लहान मूल",
      hi: "गोल चश्मा पहने छोटा बच्चा",
    },
  },
  {
    slug: "premium",
    image: "/images/categories/premium.jpg",
    imageAlt: {
      en: "Premium frame resting on a wooden stand",
      mr: "लाकडी स्टँडवर ठेवलेली प्रीमियम फ्रेम",
      hi: "लकड़ी के स्टैंड पर रखा प्रीमियम फ़्रेम",
    },
  },
  {
    slug: "everyday",
    image: "/images/categories/everyday.jpg",
    imageAlt: {
      en: "Man wearing round black eyeglasses",
      mr: "गोल काळा चष्मा घातलेला पुरुष",
      hi: "गोल काला चश्मा पहने पुरुष",
    },
  },
  {
    slug: "blue-light",
    image: "/images/categories/blue-light.jpg",
    imageAlt: {
      en: "Woman wearing glasses while using her phone",
      mr: "चष्मा घालून फोन वापरणारी स्त्री",
      hi: "चश्मा पहनकर फ़ोन इस्तेमाल करती महिला",
    },
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
