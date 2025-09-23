import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Template } from '../types/models';


interface TemplateState {
  template: Template;
  isLoading: boolean;
  errors: string[];
}

type TemplateAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_FIELD'; payload: { path: string; value: any } }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: boolean };

// Полноценный начальный шаблон со всеми параметрами
const createInitialTemplate = (): Template => ({
  TemplateName: 'New Template',
  BaseArmyMultiplier: 1.0,
  
  // General Data
  GeneralData: {},
  
  // Army Multipliers
  ArmyMultipliers: {
    Humans: 1.0,
    Inferno: 1.0,
    Necropolis: 1.0,
    Elves: 1.0,
    Liga: 1.0,
    Mages: 1.0,
    Dwarfs: 1.0,
    Horde: 1.0
  },
  
  // Empty arrays and configs
  Zones: [],
  Connections: [],
  CustomBuildingConfigs: [],
  TerrainConfig: [],
  StartBuildingConfigs: [],
  SpecificCastlesStartBuildings: [],
  ScriptFeaturesConfig: {
    CastleCaptureProps: {
      CoordinateX: 0,
      CoordinateY: 0,
      SearchRadius: 10,
      EventTimer: 1,
      DisableFortifications: true,
      IsForcedFinalBattle: false
    },
    GMRebuildProps: {
      MinimalGMLevel: 1,
      MinimalWarCriesLeveL: 1,
      RebuildCost: {
        Wood: 0,
        Ore: 0,
        Mercury: 0,
        Sulfur: 0,
        Gem: 0,
        Crystal: 0,
        Gold: 0
      }
    },
    GloballyDisabledBuildingsProps: {
      Buildings: []
    },
    ForcedFinalBattleProps: [],
    AdditionalStartCastles: []
  },
  ZoneRandomizationConfig: {
    ZonesToSwap: [],
    IsSymmetricalSwap: false,
    ZonesToRandomize: []
  },
  EntitiesBanConfig: {
    BannedHeroes: [],
    BannedSpells: [],
    BannedArtifacts: [],
    BanMaradeur: false,
    BannedBases: {
      CommonBannedSkills: [],
      SkillsBannedForClass: []
  },
},
StartSpellsConfig:{
    GlobalSpells: [],
    SpellsByPlayers: [],
    SpellsByRaces: [],
    SpellsByHeroes: []
  },
});

const initialState: TemplateState = {
  template: createInitialTemplate(),
  isLoading: false,
  errors: []
};

function templateReducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    
    case 'UPDATE_FIELD':
      const { path, value } = action.payload;
      const keys = path.split('.');
      
      // Создаем глубокую копию template
      const updatedTemplate = JSON.parse(JSON.stringify(state.template));
      
      let current = updatedTemplate;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined || current[key] === null) {
          current[key] = {};
        }
        current = current[key];
      }
      
      const lastKey = keys[keys.length - 1];
      if (value === undefined || value === '') {
        delete current[lastKey];
      } else {
        current[lastKey] = value;
      }
      
      return { ...state, template: updatedTemplate };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    default:
      return state;
  }
}

const TemplateContext = createContext<{
  state: TemplateState;
  dispatch: React.Dispatch<TemplateAction>;
} | null>(null);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  return (
    <TemplateContext.Provider value={{ state, dispatch }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within TemplateProvider');
  }
  return context;
};

export {};