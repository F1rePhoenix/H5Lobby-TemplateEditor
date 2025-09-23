import {
  BuildingType,
  BuildingMode,
  CastleType,
  BuildingTextureConfig,
  TerrainType,
  PlayerType,
  HeroClassType,
  SkillType,
  ScriptBuilding,
  DefaultBuilding,
  RoadType,
  BuildingInteractionMessage,
  HeroType,
  SpellType,
  ArtifactType,
  CreatureType,
  MapObject,
  MagicSchool,
  ArtifactSlot,
  ArtifactCategory
} from '../types/enums';

export interface CastleCaptureModel {
  CoordinateX: number;
  CoordinateY: number;
  SearchRadius?: number;
  EventTimer: number;
  DisableFortifications?: boolean;
  IsForcedFinalBattle: boolean;
}

export interface ResourcesModel {
  Wood: number;
  Ore: number;
  Mercury: number;
  Sulfur: number;
  Gem: number;
  Crystal: number;
  Gold: number;
}

export interface GMRebuildModel {
  MinimalGMLevel: number;
  MinimalWarCriesLeveL: number;
  RebuildCost?: ResourcesModel;
}

export interface GloballyDisabledBuildingsModel {
  Buildings?: BuildingType[];
}

export interface ForcedFinalBattleModel {
  Week: number;
  Day: number;
}

export interface AdditionalStartCastle {
  StartCoordinateX: number;
  StartCoordinateY: number;
  SearchRadius: number;
  TargetCoordinateX: number;
  TargetCoordinateY: number;
  TargetSearchRadius: number;
}

export interface TerrainBuildingsConfig {
  ClearBuildings?: boolean;
  BuildingsToDelete?: MapObject[];
  BuildingsToAdd?: number[];
}

export interface IntValueConfig {
  MinValue?: number;
  MaxValue?: number;
}

export interface ResourcesConfig {
  Wood?: IntValueConfig;
  Ore?: IntValueConfig;
  Mercury?: IntValueConfig;
  Crystals?: IntValueConfig;
  Sulfur?: IntValueConfig;
  Gems?: IntValueConfig;
  Gold?: IntValueConfig;
}

export interface CreatureModifier {
  Tier: number;
  CostMultiplier?: number;
  ResourcesMultiplier?: number;
  GrowMultiplier?: number;
}

export interface CreatureTierReplacement {
  Tier: number;
  CreatureIds?: CreatureType[];
}

export interface CreaturesConfiguration {
  ReplacementsCount?: IntValueConfig;
  TerrainFaction?: boolean;
  NonPlayersFactions?: boolean;
  PlayersFactions?:boolean;
  NoGrades?: boolean;
  Grades?: boolean;
  Neutrals?: boolean;
  PlayerType?: PlayerType;
  BaseCostMultiplier?: number;
  BaseResourcesMultiplier?: number;
  BaseGrowMultiplier?: number;
  CreatureModifier?: CreatureModifier[];
  CreatureTierReplacements?: CreatureTierReplacement[];
  NonUniqueReplacements?: boolean;
}

export interface RandomDwellingConfig {
  MinCount: number;
  MaxCount: number;
  MinTiersCount?: number;
  MaxTiersCount?: number;
  UniformDistribution?: boolean;
  AllowedTiers?: number[];
  MinCountPerTier?: number;
  MaxCountPerTier?: number;
}

export interface DwellingValue {
  T1?: number;
  T2?: number;
  T3?: number;
  T4?: number;
  T5?: number;
  T6?: number;
  T7?: number;
}

export interface StaticDwellingConfigs {
  DwellingValue?: DwellingValue[];
}

export interface DwellingPointsByFactionEntry {
  Key?: CastleType;
  Value?: DwellingValue;
}

export interface PointsCountByFactionEntry {
  Key?: CastleType;
  Value?: number;
}

export interface MaxCountPerTierByFactionEntry {
  Key?: CastleType;
  Value?: DwellingValue;
}

export interface MinCountPerTierByFactionEntry {
  Key?: CastleType;
  Value?: DwellingValue;
}

export interface DwellingByPointsConfig {
  PointsCount: number;
  DwellingPointsByFaction?: DwellingPointsByFactionEntry[];
  DwellingPoints?: DwellingValue;
  PointsCountByFaction?: PointsCountByFactionEntry[];
  MinTiersCount?: number;
  MaxTiersCount?: number;
  AllowedTiers?: number[];
  MinCountPerTier?: DwellingValue;
  MinCountPerTierByFaction?: MinCountPerTierByFactionEntry[];
  MaxCountPerTier?: DwellingValue;
  MaxCountPerTierByFaction?: MaxCountPerTierByFactionEntry[];
}

export interface DependantDwellingConfig {
  ZoneId: number;
  MinCount: number;
  MaxCount: number;
  MinTiersCount?: DwellingValue;
  MaxTiersCount?: DwellingValue;
  UniformDistribution?: boolean;
  MinCountPerTier?: DwellingValue;
  MaxCountPerTier?: DwellingValue;
  IsCopyMode: boolean;
}

export interface DwellingGenerationConfig {
  BuildingTexture?: BuildingTextureConfig;
  CreaturesConfiguration?: CreaturesConfiguration;
  RandomDwellingConfig?: RandomDwellingConfig;
  StaticDwellingConfigs?: StaticDwellingConfigs;
  DwellingByPointsConfig?: DwellingByPointsConfig;
  DependantDwellingConfig?: DependantDwellingConfig;
}

export interface CustomBuildingConfig {
  Id?: number;
  Value?: number;
  GuardStrenght?: number;
  BuildingTexture?: BuildingTextureConfig;
  RoadType?: RoadType;
  CreatureBuilding?: CreatureBuildingConfig;
  XdbRef?: string;
  PandoraBox?: PandoraBoxConfig;
  ResourceGiver?: ResourceBuildingConfig;
  ScriptBuilding?: ScriptBuildingConfig;
  MageEye?: MageEyeConfig;
  RunicChest?: RunicChestConfig;
  ArtifactXdb?: ArtifactXdb;
  MapObjectXdb?: MapObjectXdb;
  DefaultBuilding?: DefaultBuildingConfig;
  InteractionMessageType?: BuildingInteractionMessage;
  CustomTexts?: LocalizedCustomTextsModel;
}

export interface CreatureBuildingConfig {
  TiersPool?: number[];
  NoGrades?: boolean;
  Grades?: boolean;
  Neutrals?: boolean;
  TerrainTypes?: TerrainType[];
  PlayerFactions?: boolean;
  PlayerType?: PlayerType;
  CreatureIds?: CreatureType[];
  CostMultiplier?: number;
  ResourcesMultiplier?: number;
  GrowMultiplier?: number;
  IsDwelling?: boolean;
  GuardsPool?: BuildingGuardsArray[];
}
export interface BuildingGuardsArray{
  Guards: BuildingGuardConfig[];
}
export interface BuildingGuardConfig{
  CreatureId: CreatureType;
  GrowMultiplier: number;
}

export interface PandoraBoxConfig {
  GoldAmount?: number[];
  ExpAmount?: number[];
  Artifacts?: PandoraArtifactConfig;
  PandoraCreatureConfig?: PandoraCreatureConfig;
  Spells?: PandoraSpellConfig;
  Resources?: ResourcesConfig;
}

export interface PandoraArtifactConfig {
  Artifacts?: ArtifactType[]
  ArtifactCategories?: ArtifactCategory[];
  ArtifactSlots?: ArtifactSlot[];
  CostRanges?: IntValueConfig;
  Count?: number
}

export interface PandoraSpellConfig {
  Spells?: SpellType[];
  MagicSchools?: MagicSchool[];
  MagicTiers?: number[];
  RuneTiers?: number[];
  WarCryTiers?: number[];
  Count?: number
}

export interface PandoraCreatureConfig {
  TiersPool?: number[];
  NoGrades?: boolean;
  Grades?: boolean;
  Neutrals?:boolean;
  TerrainTypes?: TerrainType[]
  PlayerFactions?: boolean;
  PlayerType?: PlayerType;
  CreatureIds?: CreatureType[];
  GrowMultiplier?: number
}

export interface ResourceBuildingConfig {
  ResourcesConfigs: ResourcesConfig[];
}

export interface ScriptBuildingConfig {
  ScriptBuilding: ScriptBuilding;
}

export interface MageEyeConfig {
  CoordinateX: number;
  CoordinateY: number;
  Radius?: number;
}

export interface RunicChestConfig {
  Runes: SpellType[];
  RuneTiers: number[];
  Count?: number;
  ExpAmount?: number;
}

export interface ArtifactXdb {
  ArtifactType: ArtifactType;
}

export interface MapObjectXdb {
  MapObject: MapObject;
}

export interface DefaultBuildingConfig {
  DefaultBuilding: DefaultBuilding;
}

export interface LocalizedCustomTextsModel {
  Texts?: Record<string, string>;
}

export interface ResourcesConfig {
  Wood?: IntValueConfig;
  Ore?: IntValueConfig;
  Mercury?: IntValueConfig;
  Crystals?: IntValueConfig;
  Sulfur?: IntValueConfig;
  Gems?: IntValueConfig;
  Gold?: IntValueConfig;
}

export interface ArmyMultiplier {
  Humans?: number;
  Inferno?: number;
  Necropolis?: number;
  Elves?: number;
  Liga?: number;
  Mages?: number;
  Dwarfs?: number;
  Horde?: number;
}

export interface Connection {
  SourceZoneIndex: number;
  DestZoneIndex: number;
  IsMain?: boolean;
  RemoveConnection?: boolean;
  TwoWay?: boolean;
  Guarded?: boolean;
  GuardStrenght?: number;
  Wide?: boolean;
  StaticPos?: boolean;
  StartPointX?: number;
  StartPointY?: number;
  MinRadiusToSearch?: number;
  MaxRadiusToSearch?: number;
  MinRadiusToMain?: number;
  MaxRadiusToMain?: number;
  RoadType?: number;
}

export interface GeneralDataClass {
  Mine1LevelGuardLevel?: number;
  Mine2LevelGuardLevel?: number;
  MineGoldGuardLevel?: number;
}

export interface ZoneRandomizationConfig {
  ZonesToSwap?: number[];
  IsSymmetricalSwap?: boolean;
  ZonesToRandomize?: number[];
}

export interface EntitiesBanConfigClass {
  BannedHeroes?: HeroType[];
  BannedSpells?: SpellType[];
  BannedArtifacts?: ArtifactType[];
  BannedBases?: BasesBanModel;
  BanMaradeur?:boolean;
}

export interface BasesBanModel{
  CommonBannedSkills?: SkillType[];
  SkillsBannedForClass?: BannedBasesByClass[];
}

export interface BannedBasesByClass{
  Class: HeroClassType;
  Skills: SkillType[];
}

export interface StartSpellsConfig {
  GlobalSpells?: SpellType[];
  SpellsByPlayers?: StartSpellsByPlayer[];
  SpellsByRaces?: StartSpellsByRace[];
  SpellsByHeroes?: StartSpellsByHero[];
}

export interface StartSpellsByPlayer {
  PlayerType: PlayerType;
  Spells: SpellType[];
}

export interface StartSpellsByRace {
  CastleType: CastleType;
  Spells: SpellType[];
}

export interface StartSpellsByHero {
  HeroType: HeroType;
  Spells: SpellType[];
}

export interface StartBuildingConfigClass {
  ApplyAllTerrains?: boolean;
  TerrainType?: TerrainType;
  CastleType?: CastleType;
  Buildings?: BuildingType[];
  BuildingMode?: BuildingMode;
}

export interface SpecificCastlesStartBuildings {
  CoordinateX?: number;
  CoordinateY?: number;
  SearchRadius?: number;
  Buildings?: BuildingType[];
}

export interface ScriptFeatureConfig {
  CastleCaptureProps?: CastleCaptureModel;
  GMRebuildProps?: GMRebuildModel;
  GloballyDisabledBuildingsProps?: GloballyDisabledBuildingsModel;
  ForcedFinalBattleProps?: ForcedFinalBattleModel[];
  AdditionalStartCastles?: AdditionalStartCastle[];
}

export interface TerrainConfig {
  TerrainType?: TerrainType;
  MirrorTerrainType?: TerrainType;
  BuildingsToDelete?: MapObject[];
  BuildingsToAdd?: number[];
  NewLuckMoraleBuildings?: TerrainBuildingsConfig;
  NewShopBuildings?: TerrainBuildingsConfig;
  NewResourceGivers?: TerrainBuildingsConfig;
  NewUpgradeBuildings?: TerrainBuildingsConfig;
  NewShrines?: TerrainBuildingsConfig;
  NewTreasuryBuildings?: TerrainBuildingsConfig;
  NewBuffBuildings?: TerrainBuildingsConfig;
}

export interface Zone {
  ZoneId?: number;
  TerrainType?: TerrainType;
  MirrorZoneId?: number;
  DwellingGenerationConfig?: DwellingGenerationConfig;
  MineGenerationConfig?: ResourcesConfig;
  AbandonedMines?: IntValueConfig;
  UpgBuildingsDensity?: IntValueConfig;
  TreasureDensity?: IntValueConfig;
  TreasureChestDensity?: IntValueConfig;
  Prisons?: IntValueConfig;
  TownGuardStrenght?: IntValueConfig;
  ShopPoints?: IntValueConfig;
  ShrinePoints?: IntValueConfig;
  LuckMoralBuildingsDensity?: IntValueConfig;
  ResourceBuildingsDensity?: IntValueConfig;
  TreasureBuildingPoints?: IntValueConfig;
  TreasureBlocksTotalValue?: IntValueConfig;
  DenOfThieves?: IntValueConfig;
  RedwoodObservatoryDensity?: IntValueConfig;
  Size?: IntValueConfig;
  Town?: boolean;
  ZoneStartPointX?: IntValueConfig;
  ZoneStartPointY?: IntValueConfig;
  MainTownStartPointX?: IntValueConfig;
  MainTownStartPointY?: IntValueConfig;
  MainTownRotationDirection?: IntValueConfig;
  TreasureBlocksScalingFromTownDist?: boolean;
  DistBetweenTreasureBlocks?: IntValueConfig;
  AdditionalMapObjectConfig?: AdditionalMapObjectConfig
}

export interface Template {
  SpecificCastlesStartBuildings: {};
  TemplateName?: string;
  Zones?: Zone[];
  BaseArmyMultiplier?: number;
  ArmyMultipliers?: ArmyMultiplier;
  Connections?: Connection[];
  CustomBuildingConfigs?: CustomBuildingConfig[];
  TerrainConfig?: TerrainConfig[];
  ScriptFeaturesConfig?: ScriptFeatureConfig;
  StartBuildingConfigs?: StartBuildingConfigClass[];
  ZoneRandomizationConfig?: ZoneRandomizationConfig;
  GeneralData?: GeneralDataClass;
  EntitiesBanConfig?: EntitiesBanConfigClass;
  StartSpellsConfig?: StartSpellsConfig;
}

export interface AdditionalMapObjectConfig {
  StaticObjects?: AdditionalObjectModel[];
  StaticObjectsByCastle?: StaticObjectsByCastleEntry[];
  ByPointModels?: AdditionalObjectByPointsModel[];
  FewOfModels?: AdditionalObjectFewOfModel[];
  ArtifactsGenerationModels?: ArtifactsGenerationModel[];
  ResourcesGenerationModel?: ResourcesGenerationModel;
}

export interface AdditionalObjectModel {
  BuildingId?: number;
  Count?: IntValueConfig;
}

export interface StaticObjectsByCastleEntry {
  Key?: CastleType;
  Value?: AdditionalObjectModel;
}

export interface AdditionalObjectByPointsModel {
  PointsCount?: number;
  PointsCountByFaction?: PointsCountByFactionEntry;
  PointsByBuildingId?: PointsCountByBuildingIdEntry;
  MinBuildingsCount?: number;
  MaxBuildingsCount?: number;
}

export interface PointsCountByBuildingIdEntry{
  Key?: number;
  Value?: number;
}

export interface AdditionalObjectFewOfModel {
  Models?: FewOfModel[];
  Count?: IntValueConfig;
}

export interface FewOfModel {
  Objects?: AdditionalObjectModel[];
  Count?: IntValueConfig;
}

export interface ArtifactsGenerationModel {
  AllowedArtifacts?: ArtifactType[];
  MinValue?: number;
  MaxValue?: number;
  TotalValue?: number;
  AllowedDuplicatesCount?: number;
  GuardsMultiplier?: number;
}

export interface ResourcesGenerationModel {
  Wood?: IntValueConfig;
  Ore?: IntValueConfig;
  BaseResourcesGuardsMultiplier?: number;
  Mercury?: IntValueConfig;
  Gems?: IntValueConfig;
  Crystal?: IntValueConfig;
  Sulfur?: IntValueConfig;
  RareResourcesGuardsMultiplier?: number;
  Chest?: IntValueConfig;
  ChestGuardsMultiplier?: number;
  Gold?: IntValueConfig;
  GoldGuardsMultiplier?: number;
  Campfire?: IntValueConfig;
  CampfireGuardsMultiplier?: number;
}