import UniSCasino from './Uni_S_Casino.json';
import UniSCentralRush from './Uni_S_Central_Rush.json';
import UniSCentralRushOutcast from './Uni_S_Central_Rush_Outcast.json';
import UniSNative from './Uni_S_Native.json';
import UniSNativeOutcast from './Uni_S_Native_Outcast.json';
import UniSNeutralPool from './Uni_S_Neutral_Pool.json';
import UniSWindOutcast from './Uni_S_Wind_Outcast.json';
import JebusCasino from './Jebus_Casino.json';
import JebusNative from './Jebus_Native.json';
import JebusMegaTreasure from './Jebus_Mega_Treasure.json';
import JebusMegaTreasureOutcast from './Jebus_Mega_Treasure_Outcast.json';
import JebusMJO from './Jebus_MJO.json';
import MoonCasino from './Moon_Casino.json';
import MoonCentralRush from './Moon_Central_Rush.json';
import MoonNative from './Moon_Native.json';
import MoonMegaTreasure from './Moon_Mega_Treasure.json';
import EchoCasino from './Echo_Casino.json';
import EchoNative from './Echo_Native.json';
import EchoRedLine from './Echo_RedLine.json';
import EchoTimeLock from './Echo_TimeLock.json';
import NewTemplate from './New Template.json';

import { Template } from '../types/models';

// Экспортируем все шаблоны как объект
export const templates: Record<string, Template> = {
  'New Template': NewTemplate as Template,
  'Uni_S Casino': UniSCasino as Template,
  'Uni_S CentralRush': UniSCentralRush as Template,
  'Uni_S CentralRushOutcast': UniSCentralRushOutcast as Template,
  'Uni_S Native': UniSNative as Template,
  'Uni_S NativeOutcast': UniSNativeOutcast as Template,
  'Uni_S WindOutcast': UniSWindOutcast as Template,
  'Uni_S NeutralPool': UniSNeutralPool as Template,
  'Jebus Casino': JebusCasino as Template,
  'Jebus Native': JebusNative as Template,
  'Jebus MegaTreasure': JebusMegaTreasure as Template,
  'Jebus MegaTreasureOutcast': JebusMegaTreasureOutcast as Template,
  'Jebus MJO': JebusMJO as Template,
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