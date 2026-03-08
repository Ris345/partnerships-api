import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type BooleanFilter =
  { _eq: Scalars['Boolean']['input']; _neq?: never; }
  |  { _eq?: never; _neq: Scalars['Boolean']['input']; };

export type CaseAwareStringArrayFilterValue = {
  _ignoreCase?: InputMaybe<Scalars['Boolean']['input']>;
  _value: Array<Scalars['String']['input']>;
};

export type CaseAwareStringFilterValue = {
  _ignoreCase?: InputMaybe<Scalars['Boolean']['input']>;
  _value: Scalars['String']['input'];
};

export type CodeVoucherDetails = VoucherDetails & {
  __typename?: 'CodeVoucherDetails';
  instructions: Scalars['String']['output'];
  redemptionCode: Scalars['String']['output'];
  redemptionMethod: RedemptionMethod;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type DateTimeFilter =
  { _eq: Scalars['DateTime']['input']; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt: Scalars['DateTime']['input']; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte: Scalars['DateTime']['input']; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt: Scalars['DateTime']['input']; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte: Scalars['DateTime']['input']; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq: Scalars['DateTime']['input']; };

export type DistanceFilter =
  { _within: DistanceWithinFilter; };

export type DistanceOrderByCriteria = {
  _from: InputCoordinates;
  _sortOrder: SortOrder;
};

export enum DistanceUnits {
  Kilometers = 'KILOMETERS',
  Miles = 'MILES'
}

export type DistanceWithinFilter = {
  _from: InputCoordinates;
  _radius: Scalars['Float']['input'];
  _units: DistanceUnits;
};

export type IdFilter =
  { _containedBy: Array<Scalars['ID']['input']>; _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq: Scalars['ID']['input']; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt: Scalars['ID']['input']; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte: Scalars['ID']['input']; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _lt: Scalars['ID']['input']; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte: Scalars['ID']['input']; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq: Scalars['ID']['input']; };

export type InputCoordinates = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type IntFilter =
  { _eq: Scalars['Int']['input']; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt: Scalars['Int']['input']; _gte?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte: Scalars['Int']['input']; _lt?: never; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt: Scalars['Int']['input']; _lte?: never; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte: Scalars['Int']['input']; _neq?: never; }
  |  { _eq?: never; _gt?: never; _gte?: never; _lt?: never; _lte?: never; _neq: Scalars['Int']['input']; };

export enum LanguageCode {
  En = 'EN',
  Es = 'ES'
}

export type LinkVoucherDetails = VoucherDetails & {
  __typename?: 'LinkVoucherDetails';
  instructions: Scalars['String']['output'];
  redemptionLinkText?: Maybe<Scalars['String']['output']>;
  redemptionLinkUrl: Scalars['String']['output'];
  redemptionMethod: RedemptionMethod;
};

export type Location = {
  __typename?: 'Location';
  coordinates: Coordinates;
  distance: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  partner: Partner;
};


export type LocationDistanceArgs = {
  from: InputCoordinates;
  units: DistanceUnits;
};

export type LocationFilter =
  { _and: Array<LocationFilter>; _not?: never; _or?: never; distance?: never; id?: never; partner?: never; }
  |  { _and?: never; _not: LocationFilter; _or?: never; distance?: never; id?: never; partner?: never; }
  |  { _and?: never; _not?: never; _or: Array<LocationFilter>; distance?: never; id?: never; partner?: never; }
  |  { _and?: never; _not?: never; _or?: never; distance: DistanceFilter; id?: never; partner?: never; }
  |  { _and?: never; _not?: never; _or?: never; distance?: never; id: IdFilter; partner?: never; }
  |  { _and?: never; _not?: never; _or?: never; distance?: never; id?: never; partner: PartnerFilter; };

export type LocationOrderByCriteria =
  { distance: DistanceOrderByCriteria; id?: never; partner?: never; }
  |  { distance?: never; id: SortOrder; partner?: never; }
  |  { distance?: never; id?: never; partner: PartnerOrderByCriteria; };

export type LocationsCountFilter = {
  _filter?: InputMaybe<LocationFilter>;
  _value: IntFilter;
};

export type ManualVoucherDetails = VoucherDetails & {
  __typename?: 'ManualVoucherDetails';
  instructions: Scalars['String']['output'];
  redemptionMethod: RedemptionMethod;
};

export type Mutation = {
  __typename?: 'Mutation';
  retrieveVoucher?: Maybe<VoucherWithRewardSnapshot>;
};


export type MutationRetrieveVoucherArgs = {
  id: Scalars['ID']['input'];
};

export type Partner = {
  __typename?: 'Partner';
  id: Scalars['ID']['output'];
  locations: Array<Location>;
  locationsCount: Scalars['Int']['output'];
  rewards: Array<Reward>;
  rewardsCount: Scalars['Int']['output'];
  translatedDetails: PartnerDetails;
};


export type PartnerLocationsArgs = {
  filter?: InputMaybe<LocationFilter>;
  orderBy?: InputMaybe<Array<LocationOrderByCriteria>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type PartnerLocationsCountArgs = {
  filter?: InputMaybe<LocationFilter>;
};


export type PartnerRewardsArgs = {
  filter?: InputMaybe<RewardFilter>;
  orderBy?: InputMaybe<Array<RewardOrderByCriteria>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type PartnerRewardsCountArgs = {
  filter?: InputMaybe<RewardFilter>;
};


export type PartnerTranslatedDetailsArgs = {
  languageCode: LanguageCode;
};

export type PartnerDetails = {
  __typename?: 'PartnerDetails';
  description: Scalars['String']['output'];
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reasonForSupporting8by8?: Maybe<Scalars['String']['output']>;
  webAddressText?: Maybe<Scalars['String']['output']>;
  webAddressUrl?: Maybe<Scalars['String']['output']>;
};

export type PartnerDetailsFilter =
  { _and: Array<PartnerDetailsFilter>; _not?: never; _or?: never; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not: PartnerDetailsFilter; _or?: never; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or: Array<PartnerDetailsFilter>; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description: StringFilter; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description?: never; logoUrl: StringFilter; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description?: never; logoUrl?: never; name: StringFilter; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8: StringFilter; webAddressText?: never; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText: StringFilter; webAddressUrl?: never; }
  |  { _and?: never; _not?: never; _or?: never; description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl: StringFilter; };

export type PartnerDetailsOrderByCriteria =
  { description: SortOrder; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { description?: never; logoUrl: SortOrder; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { description?: never; logoUrl?: never; name: SortOrder; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl?: never; }
  |  { description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8: SortOrder; webAddressText?: never; webAddressUrl?: never; }
  |  { description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText: SortOrder; webAddressUrl?: never; }
  |  { description?: never; logoUrl?: never; name?: never; reasonForSupporting8by8?: never; webAddressText?: never; webAddressUrl: SortOrder; };

export type PartnerFilter =
  { _and: Array<PartnerFilter>; _not?: never; _or?: never; id?: never; locationsCount?: never; rewardsCount?: never; translatedDetails?: never; }
  |  { _and?: never; _not: PartnerFilter; _or?: never; id?: never; locationsCount?: never; rewardsCount?: never; translatedDetails?: never; }
  |  { _and?: never; _not?: never; _or: Array<PartnerFilter>; id?: never; locationsCount?: never; rewardsCount?: never; translatedDetails?: never; }
  |  { _and?: never; _not?: never; _or?: never; id: IdFilter; locationsCount?: never; rewardsCount?: never; translatedDetails?: never; }
  |  { _and?: never; _not?: never; _or?: never; id?: never; locationsCount: LocationsCountFilter; rewardsCount?: never; translatedDetails?: never; }
  |  { _and?: never; _not?: never; _or?: never; id?: never; locationsCount?: never; rewardsCount: RewardsCountFilter; translatedDetails?: never; }
  |  { _and?: never; _not?: never; _or?: never; id?: never; locationsCount?: never; rewardsCount?: never; translatedDetails: TranslatedPartnerDetailsFilter; };

export type PartnerOrderByCriteria =
  { id: SortOrder; translatedDetails?: never; }
  |  { id?: never; translatedDetails: TranslatedPartnerDetailsOrderByCriteria; };

export type PartnerSnapshot = {
  __typename?: 'PartnerSnapshot';
  id: Scalars['ID']['output'];
  lastUpdatedAt: Scalars['DateTime']['output'];
  translatedDetailsSnapshots: Array<TranslatedPartnerDetailsSnapshot>;
};


export type PartnerSnapshotTranslatedDetailsSnapshotsArgs = {
  languageCodes?: InputMaybe<Array<LanguageCode>>;
};

export type QrCodeVoucherDetails = VoucherDetails & {
  __typename?: 'QRCodeVoucherDetails';
  instructions: Scalars['String']['output'];
  redemptionMethod: RedemptionMethod;
  redemptionQRCode: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Scalars['String']['output']>;
  location?: Maybe<Location>;
  locations: Array<Location>;
  locationsCount: Scalars['Int']['output'];
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  partnersCount: Scalars['Int']['output'];
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  rewardsCount: Scalars['Int']['output'];
};


export type QueryCategoriesArgs = {
  languageCode: LanguageCode;
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLocationsArgs = {
  filter?: InputMaybe<LocationFilter>;
  orderBy?: InputMaybe<Array<LocationOrderByCriteria>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLocationsCountArgs = {
  filter?: InputMaybe<LocationFilter>;
};


export type QueryPartnerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPartnersArgs = {
  filter?: InputMaybe<PartnerFilter>;
  orderBy?: InputMaybe<Array<PartnerOrderByCriteria>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPartnersCountArgs = {
  filter?: InputMaybe<PartnerFilter>;
};


export type QueryRewardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRewardsArgs = {
  filter?: InputMaybe<RewardFilter>;
  orderBy?: InputMaybe<Array<RewardOrderByCriteria>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRewardsCountArgs = {
  filter?: InputMaybe<RewardFilter>;
};

export enum RedemptionForum {
  InStore = 'IN_STORE',
  Online = 'ONLINE'
}

export type RedemptionForumArrayFilter =
  { _containedBy: Array<RedemptionForum>; _containsArr?: never; _containsEl?: never; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr: Array<RedemptionForum>; _containsEl?: never; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl: RedemptionForum; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq: Array<RedemptionForum>; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq?: never; _neq: Array<RedemptionForum>; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq?: never; _neq?: never; _overlaps: Array<RedemptionForum>; };

export enum RedemptionMethod {
  Code = 'CODE',
  Link = 'LINK',
  Manual = 'MANUAL',
  QrCode = 'QR_CODE'
}

export type Reward = {
  __typename?: 'Reward';
  earliestExpirationDate?: Maybe<Scalars['DateTime']['output']>;
  hasUsageOrQuantityLimit: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  partner: Partner;
  redemptionForums: Array<RedemptionForum>;
  translatedDetails: RewardDetails;
  voucherType: VoucherType;
};


export type RewardTranslatedDetailsArgs = {
  languageCode: LanguageCode;
};

export type RewardDetails = {
  __typename?: 'RewardDetails';
  categories: Array<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription: Scalars['String']['output'];
};

export type RewardDetailsFilter =
  { _and: Array<RewardDetailsFilter>; _not?: never; _or?: never; categories?: never; longDescription?: never; shortDescription?: never; }
  |  { _and?: never; _not: RewardDetailsFilter; _or?: never; categories?: never; longDescription?: never; shortDescription?: never; }
  |  { _and?: never; _not?: never; _or: Array<RewardDetailsFilter>; categories?: never; longDescription?: never; shortDescription?: never; }
  |  { _and?: never; _not?: never; _or?: never; categories: StringArrayFilter; longDescription?: never; shortDescription?: never; }
  |  { _and?: never; _not?: never; _or?: never; categories?: never; longDescription: StringFilter; shortDescription?: never; }
  |  { _and?: never; _not?: never; _or?: never; categories?: never; longDescription?: never; shortDescription: StringFilter; };

export type RewardDetailsOrderByCriteria =
  { categories: SortOrder; longDescription?: never; shortDescription?: never; }
  |  { categories?: never; longDescription: SortOrder; shortDescription?: never; }
  |  { categories?: never; longDescription?: never; shortDescription: SortOrder; };

export type RewardFilter =
  { _and: Array<RewardFilter>; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not: RewardFilter; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or: Array<RewardFilter>; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate: DateTimeFilter; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit: BooleanFilter; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id: IdFilter; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner: PartnerFilter; redemptionForums?: never; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums: RedemptionForumArrayFilter; translatedDetails?: never; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails: TranslatedRewardDetailsFilter; voucherType?: never; }
  |  { _and?: never; _not?: never; _or?: never; earliestExpirationDate?: never; hasUsageOrQuantityLimit?: never; id?: never; partner?: never; redemptionForums?: never; translatedDetails?: never; voucherType: VoucherTypeFilter; };

export type RewardOrderByCriteria =
  { id: SortOrder; partner?: never; translatedDetails?: never; }
  |  { id?: never; partner: PartnerOrderByCriteria; translatedDetails?: never; }
  |  { id?: never; partner?: never; translatedDetails: TranslatedRewardDetailsOrderByCriteria; };

export type RewardSnapshot = {
  __typename?: 'RewardSnapshot';
  id: Scalars['ID']['output'];
  lastUpdatedAt: Scalars['DateTime']['output'];
  partnerSnapshot: PartnerSnapshot;
  redemptionForums: Array<RedemptionForum>;
  translatedDetailsSnapshots: Array<TranslatedRewardDetailsSnapshot>;
};


export type RewardSnapshotTranslatedDetailsSnapshotsArgs = {
  languageCodes?: InputMaybe<Array<LanguageCode>>;
};

export type RewardsCountFilter = {
  _filter?: InputMaybe<RewardFilter>;
  _value: IntFilter;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringArrayFilter =
  { _containedBy: CaseAwareStringArrayFilterValue; _containsArr?: never; _containsEl?: never; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr: CaseAwareStringArrayFilterValue; _containsEl?: never; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl: CaseAwareStringFilterValue; _eq?: never; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq: CaseAwareStringArrayFilterValue; _neq?: never; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq?: never; _neq: CaseAwareStringArrayFilterValue; _overlaps?: never; }
  |  { _containedBy?: never; _containsArr?: never; _containsEl?: never; _eq?: never; _neq?: never; _overlaps: CaseAwareStringArrayFilterValue; };

export type StringFilter =
  { _containedBy: CaseAwareStringArrayFilterValue; _eq?: never; _gt?: never; _gte?: never; _includes?: never; _like?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq: CaseAwareStringFilterValue; _gt?: never; _gte?: never; _includes?: never; _like?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt: Scalars['String']['input']; _gte?: never; _includes?: never; _like?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte: Scalars['String']['input']; _includes?: never; _like?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _includes: CaseAwareStringFilterValue; _like?: never; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _includes?: never; _like: CaseAwareStringFilterValue; _lt?: never; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _includes?: never; _like?: never; _lt: Scalars['String']['input']; _lte?: never; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _includes?: never; _like?: never; _lt?: never; _lte: Scalars['String']['input']; _neq?: never; }
  |  { _containedBy?: never; _eq?: never; _gt?: never; _gte?: never; _includes?: never; _like?: never; _lt?: never; _lte?: never; _neq: CaseAwareStringFilterValue; };

export type TranslatedPartnerDetailsFilter = {
  _filter: PartnerDetailsFilter;
  _languageCode: LanguageCode;
};

export type TranslatedPartnerDetailsOrderByCriteria = {
  _languageCode: LanguageCode;
  _orderBy: PartnerDetailsOrderByCriteria;
};

export type TranslatedPartnerDetailsSnapshot = {
  __typename?: 'TranslatedPartnerDetailsSnapshot';
  description: Scalars['String']['output'];
  languageCode: LanguageCode;
  lastUpdatedAt: Scalars['DateTime']['output'];
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reasonForSupporting8by8?: Maybe<Scalars['String']['output']>;
  webAddressText?: Maybe<Scalars['String']['output']>;
  webAddressUrl?: Maybe<Scalars['String']['output']>;
};

export type TranslatedRewardDetailsFilter = {
  _filter: RewardDetailsFilter;
  _languageCode: LanguageCode;
};

export type TranslatedRewardDetailsOrderByCriteria = {
  _languageCode: LanguageCode;
  _orderBy: RewardDetailsOrderByCriteria;
};

export type TranslatedRewardDetailsSnapshot = {
  __typename?: 'TranslatedRewardDetailsSnapshot';
  categories: Array<Scalars['String']['output']>;
  languageCode: LanguageCode;
  lastUpdatedAt: Scalars['DateTime']['output'];
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription: Scalars['String']['output'];
};

export type TranslatedVoucherDetails = {
  __typename?: 'TranslatedVoucherDetails';
  languageCode: LanguageCode;
  voucherDetails: Array<VoucherDetails>;
};

export type Voucher = {
  __typename?: 'Voucher';
  expirationDate?: Maybe<Scalars['DateTime']['output']>;
  translatedDetails: Array<TranslatedVoucherDetails>;
};


export type VoucherTranslatedDetailsArgs = {
  languageCodes?: InputMaybe<Array<LanguageCode>>;
};

export type VoucherDetails = {
  instructions: Scalars['String']['output'];
  redemptionMethod: RedemptionMethod;
};

export enum VoucherType {
  MultiUser = 'MULTI_USER',
  SingleUser = 'SINGLE_USER'
}

export type VoucherTypeFilter =
  { _eq: VoucherType; _neq?: never; }
  |  { _eq?: never; _neq: VoucherType; };

export type VoucherWithRewardSnapshot = {
  __typename?: 'VoucherWithRewardSnapshot';
  rewardSnapshot: RewardSnapshot;
  voucher: Voucher;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;




/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  VoucherDetails:
    | ( CodeVoucherDetails )
    | ( LinkVoucherDetails )
    | ( ManualVoucherDetails )
    | ( QrCodeVoucherDetails )
  ;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BooleanFilter: BooleanFilter;
  CaseAwareStringArrayFilterValue: CaseAwareStringArrayFilterValue;
  CaseAwareStringFilterValue: CaseAwareStringFilterValue;
  CodeVoucherDetails: ResolverTypeWrapper<CodeVoucherDetails>;
  Coordinates: ResolverTypeWrapper<Coordinates>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DateTimeFilter: DateTimeFilter;
  DistanceFilter: DistanceFilter;
  DistanceOrderByCriteria: DistanceOrderByCriteria;
  DistanceUnits: DistanceUnits;
  DistanceWithinFilter: DistanceWithinFilter;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IDFilter: IdFilter;
  InputCoordinates: InputCoordinates;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntFilter: IntFilter;
  LanguageCode: LanguageCode;
  LinkVoucherDetails: ResolverTypeWrapper<LinkVoucherDetails>;
  Location: ResolverTypeWrapper<Location>;
  LocationFilter: LocationFilter;
  LocationOrderByCriteria: LocationOrderByCriteria;
  LocationsCountFilter: LocationsCountFilter;
  ManualVoucherDetails: ResolverTypeWrapper<ManualVoucherDetails>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Partner: ResolverTypeWrapper<Partner>;
  PartnerDetails: ResolverTypeWrapper<PartnerDetails>;
  PartnerDetailsFilter: PartnerDetailsFilter;
  PartnerDetailsOrderByCriteria: PartnerDetailsOrderByCriteria;
  PartnerFilter: PartnerFilter;
  PartnerOrderByCriteria: PartnerOrderByCriteria;
  PartnerSnapshot: ResolverTypeWrapper<PartnerSnapshot>;
  QRCodeVoucherDetails: ResolverTypeWrapper<QrCodeVoucherDetails>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RedemptionForum: RedemptionForum;
  RedemptionForumArrayFilter: RedemptionForumArrayFilter;
  RedemptionMethod: RedemptionMethod;
  Reward: ResolverTypeWrapper<Reward>;
  RewardDetails: ResolverTypeWrapper<RewardDetails>;
  RewardDetailsFilter: RewardDetailsFilter;
  RewardDetailsOrderByCriteria: RewardDetailsOrderByCriteria;
  RewardFilter: RewardFilter;
  RewardOrderByCriteria: RewardOrderByCriteria;
  RewardSnapshot: ResolverTypeWrapper<RewardSnapshot>;
  RewardsCountFilter: RewardsCountFilter;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringArrayFilter: StringArrayFilter;
  StringFilter: StringFilter;
  TranslatedPartnerDetailsFilter: TranslatedPartnerDetailsFilter;
  TranslatedPartnerDetailsOrderByCriteria: TranslatedPartnerDetailsOrderByCriteria;
  TranslatedPartnerDetailsSnapshot: ResolverTypeWrapper<TranslatedPartnerDetailsSnapshot>;
  TranslatedRewardDetailsFilter: TranslatedRewardDetailsFilter;
  TranslatedRewardDetailsOrderByCriteria: TranslatedRewardDetailsOrderByCriteria;
  TranslatedRewardDetailsSnapshot: ResolverTypeWrapper<TranslatedRewardDetailsSnapshot>;
  TranslatedVoucherDetails: ResolverTypeWrapper<Omit<TranslatedVoucherDetails, 'voucherDetails'> & { voucherDetails: Array<ResolversTypes['VoucherDetails']> }>;
  Voucher: ResolverTypeWrapper<Omit<Voucher, 'translatedDetails'> & { translatedDetails: Array<ResolversTypes['TranslatedVoucherDetails']> }>;
  VoucherDetails: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['VoucherDetails']>;
  VoucherType: VoucherType;
  VoucherTypeFilter: VoucherTypeFilter;
  VoucherWithRewardSnapshot: ResolverTypeWrapper<Omit<VoucherWithRewardSnapshot, 'voucher'> & { voucher: ResolversTypes['Voucher'] }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  BooleanFilter: BooleanFilter;
  CaseAwareStringArrayFilterValue: CaseAwareStringArrayFilterValue;
  CaseAwareStringFilterValue: CaseAwareStringFilterValue;
  CodeVoucherDetails: CodeVoucherDetails;
  Coordinates: Coordinates;
  DateTime: Scalars['DateTime']['output'];
  DateTimeFilter: DateTimeFilter;
  DistanceFilter: DistanceFilter;
  DistanceOrderByCriteria: DistanceOrderByCriteria;
  DistanceWithinFilter: DistanceWithinFilter;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  IDFilter: IdFilter;
  InputCoordinates: InputCoordinates;
  Int: Scalars['Int']['output'];
  IntFilter: IntFilter;
  LinkVoucherDetails: LinkVoucherDetails;
  Location: Location;
  LocationFilter: LocationFilter;
  LocationOrderByCriteria: LocationOrderByCriteria;
  LocationsCountFilter: LocationsCountFilter;
  ManualVoucherDetails: ManualVoucherDetails;
  Mutation: Record<PropertyKey, never>;
  Partner: Partner;
  PartnerDetails: PartnerDetails;
  PartnerDetailsFilter: PartnerDetailsFilter;
  PartnerDetailsOrderByCriteria: PartnerDetailsOrderByCriteria;
  PartnerFilter: PartnerFilter;
  PartnerOrderByCriteria: PartnerOrderByCriteria;
  PartnerSnapshot: PartnerSnapshot;
  QRCodeVoucherDetails: QrCodeVoucherDetails;
  Query: Record<PropertyKey, never>;
  RedemptionForumArrayFilter: RedemptionForumArrayFilter;
  Reward: Reward;
  RewardDetails: RewardDetails;
  RewardDetailsFilter: RewardDetailsFilter;
  RewardDetailsOrderByCriteria: RewardDetailsOrderByCriteria;
  RewardFilter: RewardFilter;
  RewardOrderByCriteria: RewardOrderByCriteria;
  RewardSnapshot: RewardSnapshot;
  RewardsCountFilter: RewardsCountFilter;
  String: Scalars['String']['output'];
  StringArrayFilter: StringArrayFilter;
  StringFilter: StringFilter;
  TranslatedPartnerDetailsFilter: TranslatedPartnerDetailsFilter;
  TranslatedPartnerDetailsOrderByCriteria: TranslatedPartnerDetailsOrderByCriteria;
  TranslatedPartnerDetailsSnapshot: TranslatedPartnerDetailsSnapshot;
  TranslatedRewardDetailsFilter: TranslatedRewardDetailsFilter;
  TranslatedRewardDetailsOrderByCriteria: TranslatedRewardDetailsOrderByCriteria;
  TranslatedRewardDetailsSnapshot: TranslatedRewardDetailsSnapshot;
  TranslatedVoucherDetails: Omit<TranslatedVoucherDetails, 'voucherDetails'> & { voucherDetails: Array<ResolversParentTypes['VoucherDetails']> };
  Voucher: Omit<Voucher, 'translatedDetails'> & { translatedDetails: Array<ResolversParentTypes['TranslatedVoucherDetails']> };
  VoucherDetails: ResolversInterfaceTypes<ResolversParentTypes>['VoucherDetails'];
  VoucherTypeFilter: VoucherTypeFilter;
  VoucherWithRewardSnapshot: Omit<VoucherWithRewardSnapshot, 'voucher'> & { voucher: ResolversParentTypes['Voucher'] };
};

export type CodeVoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CodeVoucherDetails'] = ResolversParentTypes['CodeVoucherDetails']> = {
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionMethod?: Resolver<ResolversTypes['RedemptionMethod'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoordinatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Coordinates'] = ResolversParentTypes['Coordinates']> = {
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type LinkVoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LinkVoucherDetails'] = ResolversParentTypes['LinkVoucherDetails']> = {
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionLinkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  redemptionLinkUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionMethod?: Resolver<ResolversTypes['RedemptionMethod'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  coordinates?: Resolver<ResolversTypes['Coordinates'], ParentType, ContextType>;
  distance?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<LocationDistanceArgs, 'from' | 'units'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  partner?: Resolver<ResolversTypes['Partner'], ParentType, ContextType>;
};

export type ManualVoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManualVoucherDetails'] = ResolversParentTypes['ManualVoucherDetails']> = {
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionMethod?: Resolver<ResolversTypes['RedemptionMethod'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  retrieveVoucher?: Resolver<Maybe<ResolversTypes['VoucherWithRewardSnapshot']>, ParentType, ContextType, RequireFields<MutationRetrieveVoucherArgs, 'id'>>;
};

export type PartnerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Partner'] = ResolversParentTypes['Partner']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType, Partial<PartnerLocationsArgs>>;
  locationsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<PartnerLocationsCountArgs>>;
  rewards?: Resolver<Array<ResolversTypes['Reward']>, ParentType, ContextType, Partial<PartnerRewardsArgs>>;
  rewardsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<PartnerRewardsCountArgs>>;
  translatedDetails?: Resolver<ResolversTypes['PartnerDetails'], ParentType, ContextType, RequireFields<PartnerTranslatedDetailsArgs, 'languageCode'>>;
};

export type PartnerDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PartnerDetails'] = ResolversParentTypes['PartnerDetails']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reasonForSupporting8by8?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webAddressText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webAddressUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PartnerSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['PartnerSnapshot'] = ResolversParentTypes['PartnerSnapshot']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  translatedDetailsSnapshots?: Resolver<Array<ResolversTypes['TranslatedPartnerDetailsSnapshot']>, ParentType, ContextType, Partial<PartnerSnapshotTranslatedDetailsSnapshotsArgs>>;
};

export type QrCodeVoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['QRCodeVoucherDetails'] = ResolversParentTypes['QRCodeVoucherDetails']> = {
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  redemptionMethod?: Resolver<ResolversTypes['RedemptionMethod'], ParentType, ContextType>;
  redemptionQRCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryCategoriesArgs, 'languageCode'>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationsArgs, 'take'>>;
  locationsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryLocationsCountArgs>>;
  partner?: Resolver<Maybe<ResolversTypes['Partner']>, ParentType, ContextType, RequireFields<QueryPartnerArgs, 'id'>>;
  partners?: Resolver<Array<ResolversTypes['Partner']>, ParentType, ContextType, RequireFields<QueryPartnersArgs, 'take'>>;
  partnersCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryPartnersCountArgs>>;
  reward?: Resolver<Maybe<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<QueryRewardArgs, 'id'>>;
  rewards?: Resolver<Array<ResolversTypes['Reward']>, ParentType, ContextType, RequireFields<QueryRewardsArgs, 'take'>>;
  rewardsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryRewardsCountArgs>>;
};

export type RewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reward'] = ResolversParentTypes['Reward']> = {
  earliestExpirationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  hasUsageOrQuantityLimit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  partner?: Resolver<ResolversTypes['Partner'], ParentType, ContextType>;
  redemptionForums?: Resolver<Array<ResolversTypes['RedemptionForum']>, ParentType, ContextType>;
  translatedDetails?: Resolver<ResolversTypes['RewardDetails'], ParentType, ContextType, RequireFields<RewardTranslatedDetailsArgs, 'languageCode'>>;
  voucherType?: Resolver<ResolversTypes['VoucherType'], ParentType, ContextType>;
};

export type RewardDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RewardDetails'] = ResolversParentTypes['RewardDetails']> = {
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  longDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RewardSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['RewardSnapshot'] = ResolversParentTypes['RewardSnapshot']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  partnerSnapshot?: Resolver<ResolversTypes['PartnerSnapshot'], ParentType, ContextType>;
  redemptionForums?: Resolver<Array<ResolversTypes['RedemptionForum']>, ParentType, ContextType>;
  translatedDetailsSnapshots?: Resolver<Array<ResolversTypes['TranslatedRewardDetailsSnapshot']>, ParentType, ContextType, Partial<RewardSnapshotTranslatedDetailsSnapshotsArgs>>;
};

export type TranslatedPartnerDetailsSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslatedPartnerDetailsSnapshot'] = ResolversParentTypes['TranslatedPartnerDetailsSnapshot']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  lastUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reasonForSupporting8by8?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webAddressText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webAddressUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type TranslatedRewardDetailsSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslatedRewardDetailsSnapshot'] = ResolversParentTypes['TranslatedRewardDetailsSnapshot']> = {
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  lastUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  longDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TranslatedVoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslatedVoucherDetails'] = ResolversParentTypes['TranslatedVoucherDetails']> = {
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  voucherDetails?: Resolver<Array<ResolversTypes['VoucherDetails']>, ParentType, ContextType>;
};

export type VoucherResolvers<ContextType = any, ParentType extends ResolversParentTypes['Voucher'] = ResolversParentTypes['Voucher']> = {
  expirationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  translatedDetails?: Resolver<Array<ResolversTypes['TranslatedVoucherDetails']>, ParentType, ContextType, Partial<VoucherTranslatedDetailsArgs>>;
};

export type VoucherDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoucherDetails'] = ResolversParentTypes['VoucherDetails']> = {
  __resolveType: TypeResolveFn<'CodeVoucherDetails' | 'LinkVoucherDetails' | 'ManualVoucherDetails' | 'QRCodeVoucherDetails', ParentType, ContextType>;
};

export type VoucherWithRewardSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoucherWithRewardSnapshot'] = ResolversParentTypes['VoucherWithRewardSnapshot']> = {
  rewardSnapshot?: Resolver<ResolversTypes['RewardSnapshot'], ParentType, ContextType>;
  voucher?: Resolver<ResolversTypes['Voucher'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CodeVoucherDetails?: CodeVoucherDetailsResolvers<ContextType>;
  Coordinates?: CoordinatesResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  LinkVoucherDetails?: LinkVoucherDetailsResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  ManualVoucherDetails?: ManualVoucherDetailsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Partner?: PartnerResolvers<ContextType>;
  PartnerDetails?: PartnerDetailsResolvers<ContextType>;
  PartnerSnapshot?: PartnerSnapshotResolvers<ContextType>;
  QRCodeVoucherDetails?: QrCodeVoucherDetailsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reward?: RewardResolvers<ContextType>;
  RewardDetails?: RewardDetailsResolvers<ContextType>;
  RewardSnapshot?: RewardSnapshotResolvers<ContextType>;
  TranslatedPartnerDetailsSnapshot?: TranslatedPartnerDetailsSnapshotResolvers<ContextType>;
  TranslatedRewardDetailsSnapshot?: TranslatedRewardDetailsSnapshotResolvers<ContextType>;
  TranslatedVoucherDetails?: TranslatedVoucherDetailsResolvers<ContextType>;
  Voucher?: VoucherResolvers<ContextType>;
  VoucherDetails?: VoucherDetailsResolvers<ContextType>;
  VoucherWithRewardSnapshot?: VoucherWithRewardSnapshotResolvers<ContextType>;
};

