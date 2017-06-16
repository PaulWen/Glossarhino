/**
 * Interface to define what LanguagePopover needs implemented in order to work
 */
export interface LanguagePopoverPageInterface {
    getLanguages: () => Array<String>;
    getLanguage: () => String;
    setLanguage: (language: String) => void;
}