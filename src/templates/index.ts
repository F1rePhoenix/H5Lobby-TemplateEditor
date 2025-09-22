import UniSCasino from './Uni_S Casino.json';
import UniSCentralRush from './Uni_S CentralRush.json';
import UniSNative from './Uni_S Native.json';
import UniSNeutralPool from './Uni_S NeutralPool.json';
import JebusCasino from './Jebus Casino.json';
import JebusNative from './Jebus Native.json';
import JebusMegaTreasure from './Jebus MegaTreasure.json';
import MoonCasino from './Moon Casino.json';
import MoonCentralRush from './Moon CentralRush.json';
import MoonNative from './Moon Native.json';
import MoonMegaTreasure from './Moon MegaTreasure.json';
import EchoCasino from './Echo Casino.json';
import EchoNative from './Echo Native.json';
import EchoRedLine from './Echo RedLine.json';
import EchoTimeLock from './Echo TimeLock.json';
import NewTemplate from './New Template.json';

import { Template } from '../types/models';

// Экспортируем все шаблоны как объект
export const templates: Record<string, Template> = {
  'New Template': NewTemplate as Template,
  'Uni_S Casino': UniSCasino as Template,
  'Uni_S CentralRush': UniSCentralRush as Template,
  'Uni_S Native': UniSNative as Template,
  'Uni_S NeutralPool': UniSNeutralPool as Template,
  'Jebus Casino': JebusCasino as Template,
  'Jebus Native': JebusNative as Template,
  'Jebus MegaTreasure': JebusMegaTreasure as Template,
  'Moon Casino': MoonCasino as Template,
  'Moon CentralRush': MoonCentralRush as Template,
  'Moon Native': MoonNative as Template,
  'Moon MegaTreasure': MoonMegaTreasure as Template,
  'Echo Casino': EchoCasino as Template,
  'Echo Native': EchoNative as Template,
  'Echo RedLine': EchoRedLine as Template,
  'Echo TimeLock': EchoTimeLock as Template,
};

// Тип для ключей шаблонов
export type TemplateKey = keyof typeof templates;

// Вспомогательная функция для получения шаблона по имени
export const getTemplate = (key: string): Template | undefined => {
  return templates[key];
};

// Экспорт списка имен шаблонов для удобства
export const templateNames = Object.keys(templates);

export default templates;