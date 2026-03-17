import { useFlowStore } from '../store/flowStore';
import { getTranslation, translateCategory, translateNodeLabel, type TranslationKey } from './translations';

export type { Language } from './translations';
export { translateCategory, translateNodeLabel } from './translations';

export function useI18n() {
  const language = useFlowStore((s) => s.language);

  function t(key: TranslationKey): string;
  function t<A extends unknown[]>(key: TranslationKey, ...args: A): string;
  function t(key: TranslationKey, ...args: unknown[]): string {
    const val = getTranslation(key, language);
    if (typeof val === 'function') {
      return (val as (...a: unknown[]) => string)(...args);
    }
    return val;
  }

  return {
    t,
    lang: language,
    tCat: (category: string) => translateCategory(category, language),
    tNode: (nodeId: string, label: string) => translateNodeLabel(nodeId, label, language),
  };
}
