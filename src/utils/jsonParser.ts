import { Template } from '../types/models';

export const parseTemplateJson = (jsonString: string): Template => {
  try {
    return JSON.parse(jsonString) as Template;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const stringifyTemplate = (template: Template): string => {
  return JSON.stringify(template, null, 2);
};

export {};
