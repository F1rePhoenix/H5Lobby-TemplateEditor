import { Template } from '../types/models';

export const validateTemplate = (template: Template): string[] => {
  const errors: string[] = [];

  if (!template.TemplateName) {
    errors.push('Template name is required');
  }

  if (template.BaseArmyMultiplier && template.BaseArmyMultiplier <= 0) {
    errors.push('Base army multiplier must be positive');
  }

  return errors;
};

export {};