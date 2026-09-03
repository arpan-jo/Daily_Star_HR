/**
 * App languages and their strings.
 *
 * Pure data + a pure lookup, deliberately: i18n.ts holds the MMKV-backed
 * current-language state, this file holds nothing, so it can be unit tested
 * without native modules. Same split as palettes.ts / Themes.ts.
 *
 * Adding a language is one entry in LANGUAGES and one entry in STRINGS —
 * missing keys fall back to English, so a partial translation is safe to ship.
 */
export type LangId = 'en' | 'bn';

export const LANGUAGES: {id: LangId; label: string}[] = [
  {id: 'en', label: 'English'},
  {id: 'bn', label: 'বাংলা'},
];

/** English is the source of truth — every other language may be partial. */
const en = {
  // Bottom tab labels. Separate from the route names, which are navigation
  // targets and must stay in English.
  'tab.home': 'Home',
  'tab.services': 'Services',
  'tab.approval': 'Approval',
  'tab.approvals': 'Approvals',
  'tab.more': 'More',
  'tab.dashboard': 'Dashboard',
  'tab.application': 'Application',
  'tab.report': 'Report',
  'tab.dialpad': 'Dialpad',
  'tab.contacts': 'Contacts',

  'more.appearance': 'Appearance',
  'more.language': 'Language',
  'more.privacy': 'Privacy & Security',
  'more.terms': 'Terms of services',
  'more.privacyPolicy': 'Privacy Policy',
  'more.others': 'Others',
  'more.voiceRecorder': 'Voice Recorder',
  'more.biometric': 'Biometric Setup',
  'more.feedback': 'Feedback',
  'more.faq': "FAQ's",
  'more.changePassword': 'Change Password',
  'more.rateApp': 'Rate App',
  'more.about': 'About Peopledesk',
  'more.updateAvailable': 'Update Available',
  // Two logout labels because the drawer and the More screens ship different
  // English ('Logout' vs 'Log Out'); same word in every other language.
  'more.logOut': 'Log Out',
  'more.followUs': 'Follow Us',
  'more.logoutConfirm': 'Are you sure you want to logout?',
  'more.biometricConfirm': 'Are you sure you want to save biometric?',
  'common.confirm': 'Confirm',
  'common.setup': 'Setup',
  'common.email': 'Email',
  'common.password': 'Password',
  'common.logout': 'Logout',
};

const bn: Partial<Record<keyof typeof en, string>> = {
  'tab.home': 'হোম',
  'tab.services': 'সেবাসমূহ',
  'tab.approval': 'অনুমোদন',
  'tab.approvals': 'অনুমোদনসমূহ',
  'tab.more': 'আরও',
  'tab.dashboard': 'ড্যাশবোর্ড',
  'tab.application': 'আবেদন',
  'tab.report': 'রিপোর্ট',
  'tab.dialpad': 'ডায়ালপ্যাড',
  'tab.contacts': 'পরিচিতি',

  'more.appearance': 'প্রদর্শন',
  'more.language': 'ভাষা',
  'more.privacy': 'গোপনীয়তা ও নিরাপত্তা',
  'more.terms': 'সেবার শর্তাবলি',
  'more.privacyPolicy': 'গোপনীয়তা নীতি',
  'more.others': 'অন্যান্য',
  'more.voiceRecorder': 'ভয়েস রেকর্ডার',
  'more.biometric': 'বায়োমেট্রিক সেটআপ',
  'more.feedback': 'মতামত',
  'more.faq': 'সাধারণ জিজ্ঞাসা',
  'more.changePassword': 'পাসওয়ার্ড পরিবর্তন',
  'more.rateApp': 'অ্যাপ রেটিং দিন',
  'more.about': 'পিপলডেস্ক সম্পর্কে',
  'more.updateAvailable': 'আপডেট রয়েছে',
  'more.logOut': 'লগআউট',
  'more.followUs': 'আমাদের অনুসরণ করুন',
  'more.logoutConfirm': 'আপনি কি লগআউট করতে চান?',
  'more.biometricConfirm': 'আপনি কি বায়োমেট্রিক সংরক্ষণ করতে চান?',
  'common.confirm': 'নিশ্চিত করুন',
  'common.setup': 'সেটআপ',
  'common.email': 'ইমেইল',
  'common.password': 'পাসওয়ার্ড',
  'common.logout': 'লগআউট',
};

export type StringKey = keyof typeof en;

export const STRINGS: Record<LangId, Partial<Record<StringKey, string>>> = {
  en,
  bn,
};

/**
 * `{name}` placeholders are filled from `vars`; an unknown placeholder is left
 * as written rather than printed as "undefined", and an unknown key returns
 * the key itself so a missing string shows up in the UI instead of a blank.
 */
export const translate = (
  lang: LangId,
  key: StringKey,
  vars?: Record<string, string | number>,
): string => {
  const raw = STRINGS[lang]?.[key] ?? en[key] ?? key;
  return vars
    ? raw.replace(/\{(\w+)\}/g, (match, name) =>
        vars[name] === undefined ? match : String(vars[name]),
      )
    : raw;
};
