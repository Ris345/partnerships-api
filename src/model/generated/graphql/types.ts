import {
  Kind,
  valueFromASTUntyped,
  type GraphQLResolveInfo,
  type SelectionNode,
  type FieldNode,
} from 'graphql';

export type Flatten<T extends any[][]> = T[number][number][];

export type BooleanFilter =
  | {
      _eq?: boolean;
      _neq?: never;
    }
  | {
      _neq?: boolean;
      _eq?: never;
    };

export interface CaseAwareStringArrayFilterValue {
  _value: string[];
  _ignoreCase?: boolean;
}

export interface CaseAwareStringFilterValue {
  _value: string;
  _ignoreCase?: boolean;
}

export type DateTimeFilter =
  | {
      _eq?: any;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _neq?: any;
      _eq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _gt?: any;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _lt?: any;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _gte?: any;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _lte?: never;
    }
  | {
      _lte?: any;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
    };

export type DistanceFilter = {
  _within?: DistanceWithinFilter;
};

export interface DistanceOrderByCriteria {
  _from: InputCoordinates;
  _sortOrder: any;
}

export enum DistanceUnits {
  KILOMETERS = 'KILOMETERS',
  MILES = 'MILES',
}

export interface DistanceWithinFilter {
  _radius: number;
  _from: InputCoordinates;
  _units: any;
}

export type IDFilter =
  | {
      _eq?: string;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
      _containedBy?: never;
    }
  | {
      _neq?: string;
      _eq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
      _containedBy?: never;
    }
  | {
      _gt?: string;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
      _containedBy?: never;
    }
  | {
      _lt?: string;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _containedBy?: never;
    }
  | {
      _gte?: string;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _lte?: never;
      _containedBy?: never;
    }
  | {
      _lte?: string;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _containedBy?: never;
    }
  | {
      _containedBy?: string[];
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    };

export interface InputCoordinates {
  latitude: number;
  longitude: number;
}

export type IntFilter =
  | {
      _eq?: number;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _neq?: number;
      _eq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _gt?: number;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _lt?: number;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
    }
  | {
      _gte?: number;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _lte?: never;
    }
  | {
      _lte?: number;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _lt?: never;
      _gte?: never;
    };

export enum LanguageCode {
  EN = 'EN',
  ES = 'ES',
}

export type LocationFilter =
  | {
      id?: IDFilter;
      distance?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      distance?: DistanceFilter;
      id?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      partner?: PartnerFilter;
      id?: never;
      distance?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _and?: LocationFilter[];
      id?: never;
      distance?: never;
      partner?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _or?: LocationFilter[];
      id?: never;
      distance?: never;
      partner?: never;
      _and?: never;
      _not?: never;
    }
  | {
      _not?: LocationFilter;
      id?: never;
      distance?: never;
      partner?: never;
      _and?: never;
      _or?: never;
    };

export type LocationOrderByCriteria =
  | {
      id?: any;
      distance?: never;
      partner?: never;
    }
  | {
      distance?: DistanceOrderByCriteria;
      id?: never;
      partner?: never;
    }
  | {
      partner?: PartnerOrderByCriteria;
      id?: never;
      distance?: never;
    };

export interface LocationsCountFilter {
  _value: IntFilter;
  _filter?: LocationFilter;
}

export type PartnerDetailsFilter =
  | {
      name?: StringFilter;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      logoUrl?: StringFilter;
      name?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      description?: StringFilter;
      name?: never;
      logoUrl?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      webAddressUrl?: StringFilter;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      webAddressText?: StringFilter;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      reasonForSupporting8by8?: StringFilter;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _and?: PartnerDetailsFilter[];
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _or?: PartnerDetailsFilter[];
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _not?: never;
    }
  | {
      _not?: PartnerDetailsFilter;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
      _and?: never;
      _or?: never;
    };

export type PartnerDetailsOrderByCriteria =
  | {
      name?: any;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
    }
  | {
      logoUrl?: any;
      name?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
    }
  | {
      description?: any;
      name?: never;
      logoUrl?: never;
      webAddressUrl?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
    }
  | {
      webAddressUrl?: any;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressText?: never;
      reasonForSupporting8by8?: never;
    }
  | {
      webAddressText?: any;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      reasonForSupporting8by8?: never;
    }
  | {
      reasonForSupporting8by8?: any;
      name?: never;
      logoUrl?: never;
      description?: never;
      webAddressUrl?: never;
      webAddressText?: never;
    };

export type PartnerFilter =
  | {
      id?: IDFilter;
      translatedDetails?: never;
      rewardsCount?: never;
      locationsCount?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      translatedDetails?: TranslatedPartnerDetailsFilter;
      id?: never;
      rewardsCount?: never;
      locationsCount?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      rewardsCount?: RewardsCountFilter;
      id?: never;
      translatedDetails?: never;
      locationsCount?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      locationsCount?: LocationsCountFilter;
      id?: never;
      translatedDetails?: never;
      rewardsCount?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _and?: PartnerFilter[];
      id?: never;
      translatedDetails?: never;
      rewardsCount?: never;
      locationsCount?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _or?: PartnerFilter[];
      id?: never;
      translatedDetails?: never;
      rewardsCount?: never;
      locationsCount?: never;
      _and?: never;
      _not?: never;
    }
  | {
      _not?: PartnerFilter;
      id?: never;
      translatedDetails?: never;
      rewardsCount?: never;
      locationsCount?: never;
      _and?: never;
      _or?: never;
    };

export type PartnerOrderByCriteria =
  | {
      id?: any;
      translatedDetails?: never;
    }
  | {
      translatedDetails?: TranslatedPartnerDetailsOrderByCriteria;
      id?: never;
    };

export enum RedemptionForum {
  ONLINE = 'ONLINE',
  IN_STORE = 'IN_STORE',
}

export type RedemptionForumArrayFilter =
  | {
      _eq?: any[];
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _neq?: any[];
      _eq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containsEl?: any;
      _eq?: never;
      _neq?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containsArr?: any[];
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containedBy?: any[];
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _overlaps?: never;
    }
  | {
      _overlaps?: any[];
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
    };

export enum RedemptionMethod {
  CODE = 'CODE',
  QR_CODE = 'QR_CODE',
  LINK = 'LINK',
  MANUAL = 'MANUAL',
}

export type RewardDetailsFilter =
  | {
      categories?: StringArrayFilter;
      shortDescription?: never;
      longDescription?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      shortDescription?: StringFilter;
      categories?: never;
      longDescription?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      longDescription?: StringFilter;
      categories?: never;
      shortDescription?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _and?: RewardDetailsFilter[];
      categories?: never;
      shortDescription?: never;
      longDescription?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _or?: RewardDetailsFilter[];
      categories?: never;
      shortDescription?: never;
      longDescription?: never;
      _and?: never;
      _not?: never;
    }
  | {
      _not?: RewardDetailsFilter;
      categories?: never;
      shortDescription?: never;
      longDescription?: never;
      _and?: never;
      _or?: never;
    };

export type RewardDetailsOrderByCriteria =
  | {
      categories?: any;
      shortDescription?: never;
      longDescription?: never;
    }
  | {
      shortDescription?: any;
      categories?: never;
      longDescription?: never;
    }
  | {
      longDescription?: any;
      categories?: never;
      shortDescription?: never;
    };

export type RewardFilter =
  | {
      id?: IDFilter;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      voucherType?: VoucherOwnershipFilter;
      id?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      redemptionForums?: RedemptionForumArrayFilter;
      id?: never;
      voucherType?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      translatedDetails?: TranslatedRewardDetailsFilter;
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      hasUsageOrQuantityLimit?: BooleanFilter;
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      earliestExpirationDate?: DateTimeFilter;
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      partner?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      partner?: PartnerFilter;
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      _and?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _and?: RewardFilter[];
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _or?: never;
      _not?: never;
    }
  | {
      _or?: RewardFilter[];
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _not?: never;
    }
  | {
      _not?: RewardFilter;
      id?: never;
      voucherType?: never;
      redemptionForums?: never;
      translatedDetails?: never;
      hasUsageOrQuantityLimit?: never;
      earliestExpirationDate?: never;
      partner?: never;
      _and?: never;
      _or?: never;
    };

export type RewardOrderByCriteria =
  | {
      id?: any;
      partner?: never;
      translatedDetails?: never;
    }
  | {
      partner?: PartnerOrderByCriteria;
      id?: never;
      translatedDetails?: never;
    }
  | {
      translatedDetails?: TranslatedRewardDetailsOrderByCriteria;
      id?: never;
      partner?: never;
    };

export interface RewardsCountFilter {
  _value: IntFilter;
  _filter?: RewardFilter;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type StringArrayFilter =
  | {
      _eq?: CaseAwareStringArrayFilterValue;
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _neq?: CaseAwareStringArrayFilterValue;
      _eq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containsEl?: CaseAwareStringFilterValue;
      _eq?: never;
      _neq?: never;
      _containsArr?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containsArr?: CaseAwareStringArrayFilterValue;
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containedBy?: never;
      _overlaps?: never;
    }
  | {
      _containedBy?: CaseAwareStringArrayFilterValue;
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _overlaps?: never;
    }
  | {
      _overlaps?: CaseAwareStringArrayFilterValue;
      _eq?: never;
      _neq?: never;
      _containsEl?: never;
      _containsArr?: never;
      _containedBy?: never;
    };

export type StringFilter =
  | {
      _eq?: CaseAwareStringFilterValue;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _neq?: CaseAwareStringFilterValue;
      _eq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _lt?: string;
      _eq?: never;
      _neq?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _gt?: string;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _gte?: string;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _lte?: string;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _includes?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _includes?: CaseAwareStringFilterValue;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _like?: never;
      _containedBy?: never;
    }
  | {
      _like?: CaseAwareStringFilterValue;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _containedBy?: never;
    }
  | {
      _containedBy?: CaseAwareStringArrayFilterValue;
      _eq?: never;
      _neq?: never;
      _lt?: never;
      _gt?: never;
      _gte?: never;
      _lte?: never;
      _includes?: never;
      _like?: never;
    };

export interface TranslatedPartnerDetailsFilter {
  _languageCode: any;
  _filter: PartnerDetailsFilter;
}

export interface TranslatedPartnerDetailsOrderByCriteria {
  _languageCode: any;
  _orderBy: PartnerDetailsOrderByCriteria;
}

export interface TranslatedRewardDetailsFilter {
  _languageCode: any;
  _filter: RewardDetailsFilter;
}

export interface TranslatedRewardDetailsOrderByCriteria {
  _languageCode: any;
  _orderBy: RewardDetailsOrderByCriteria;
}

export enum VoucherOwnership {
  MULTI_USER = 'MULTI_USER',
  SINGLE_USER = 'SINGLE_USER',
}

export type VoucherOwnershipFilter =
  | {
      _eq?: any;
      _neq?: never;
    }
  | {
      _neq?: any;
      _eq?: never;
    };

export type CodeVoucherDetailsFields = (
  | {
      name: 'redemptionMethod';
      on: 'CodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'instructions';
      on: 'CodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionCode';
      on: 'CodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'CodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type CoordinatesFields = (
  | {
      name: 'latitude';
      on: 'Coordinates';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'longitude';
      on: 'Coordinates';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'Coordinates';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type LinkVoucherDetailsFields = (
  | {
      name: 'redemptionMethod';
      on: 'LinkVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'instructions';
      on: 'LinkVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionLinkUrl';
      on: 'LinkVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionLinkText';
      on: 'LinkVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'LinkVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type LocationFields = (
  | {
      name: 'id';
      on: 'Location';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'coordinates';
      on: 'Location';
      alias: string;
      arguments: {};
      fields: CoordinatesFields;
    }
  | {
      name: 'distance';
      on: 'Location';
      alias: string;
      arguments: {
        from: InputCoordinates;
        units: DistanceUnits;
      };
      fields: never;
    }
  | {
      name: 'partner';
      on: 'Location';
      alias: string;
      arguments: {};
      fields: PartnerFields;
    }
  | {
      name: '__typename';
      on: 'Location';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type ManualVoucherDetailsFields = (
  | {
      name: 'redemptionMethod';
      on: 'ManualVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'instructions';
      on: 'ManualVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'ManualVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type MutationFields = (
  | {
      name: 'retrieveVoucher';
      on: 'Mutation';
      alias: string;
      arguments: {
        id: string;
      };
      fields: VoucherWithRewardSnapshotFields;
    }
  | {
      name: '__typename';
      on: 'Mutation';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type PartnerFields = (
  | {
      name: 'id';
      on: 'Partner';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'translatedDetails';
      on: 'Partner';
      alias: string;
      arguments: {
        languageCode: LanguageCode;
      };
      fields: PartnerDetailsFields;
    }
  | {
      name: 'locations';
      on: 'Partner';
      alias: string;
      arguments: {
        filter?: LocationFilter;
        orderBy?: LocationOrderByCriteria[];
        take?: number;
      };
      fields: LocationFields;
    }
  | {
      name: 'locationsCount';
      on: 'Partner';
      alias: string;
      arguments: {
        filter?: LocationFilter;
      };
      fields: never;
    }
  | {
      name: 'rewards';
      on: 'Partner';
      alias: string;
      arguments: {
        filter?: RewardFilter;
        orderBy?: RewardOrderByCriteria[];
        take?: number;
      };
      fields: RewardFields;
    }
  | {
      name: 'rewardsCount';
      on: 'Partner';
      alias: string;
      arguments: {
        filter?: RewardFilter;
      };
      fields: never;
    }
  | {
      name: '__typename';
      on: 'Partner';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type PartnerDetailsFields = (
  | {
      name: 'name';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'logoUrl';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'description';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'webAddressUrl';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'webAddressText';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'reasonForSupporting8by8';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'PartnerDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type PartnerSnapshotFields = (
  | {
      name: 'id';
      on: 'PartnerSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'translatedDetailsSnapshots';
      on: 'PartnerSnapshot';
      alias: string;
      arguments: {
        languageCodes?: LanguageCode[];
      };
      fields: TranslatedPartnerDetailsSnapshotFields;
    }
  | {
      name: 'lastUpdatedAt';
      on: 'PartnerSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'PartnerSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type QRCodeVoucherDetailsFields = (
  | {
      name: 'redemptionMethod';
      on: 'QRCodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'instructions';
      on: 'QRCodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionQRCode';
      on: 'QRCodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'QRCodeVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type QueryFields = (
  | {
      name: 'partner';
      on: 'Query';
      alias: string;
      arguments: {
        id: string;
      };
      fields: PartnerFields;
    }
  | {
      name: 'partners';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: PartnerFilter;
        orderBy?: PartnerOrderByCriteria[];
        take?: number;
      };
      fields: PartnerFields;
    }
  | {
      name: 'partnersCount';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: PartnerFilter;
      };
      fields: never;
    }
  | {
      name: 'location';
      on: 'Query';
      alias: string;
      arguments: {
        id: string;
      };
      fields: LocationFields;
    }
  | {
      name: 'locations';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: LocationFilter;
        orderBy?: LocationOrderByCriteria[];
        take?: number;
      };
      fields: LocationFields;
    }
  | {
      name: 'locationsCount';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: LocationFilter;
      };
      fields: never;
    }
  | {
      name: 'reward';
      on: 'Query';
      alias: string;
      arguments: {
        id: string;
      };
      fields: RewardFields;
    }
  | {
      name: 'rewards';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: RewardFilter;
        orderBy?: RewardOrderByCriteria[];
        take?: number;
      };
      fields: RewardFields;
    }
  | {
      name: 'rewardsCount';
      on: 'Query';
      alias: string;
      arguments: {
        filter?: RewardFilter;
      };
      fields: never;
    }
  | {
      name: 'categories';
      on: 'Query';
      alias: string;
      arguments: {
        languageCode: LanguageCode;
      };
      fields: never;
    }
  | {
      name: '__typename';
      on: 'Query';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type RewardFields = (
  | {
      name: 'id';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'voucherOwnership';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionForums';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'translatedDetails';
      on: 'Reward';
      alias: string;
      arguments: {
        languageCode: LanguageCode;
      };
      fields: RewardDetailsFields;
    }
  | {
      name: 'hasUsageOrQuantityLimit';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'earliestExpirationDate';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'partner';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: PartnerFields;
    }
  | {
      name: '__typename';
      on: 'Reward';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type RewardDetailsFields = (
  | {
      name: 'categories';
      on: 'RewardDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'shortDescription';
      on: 'RewardDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'longDescription';
      on: 'RewardDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'RewardDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type RewardSnapshotFields = (
  | {
      name: 'id';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'redemptionForums';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'translatedDetailsSnapshots';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {
        languageCodes?: LanguageCode[];
      };
      fields: TranslatedRewardDetailsSnapshotFields;
    }
  | {
      name: 'partnerSnapshot';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {};
      fields: PartnerSnapshotFields;
    }
  | {
      name: 'lastUpdatedAt';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'RewardSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type TranslatedPartnerDetailsSnapshotFields = (
  | {
      name: 'languageCode';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'name';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'logoUrl';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'description';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'webAddressUrl';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'webAddressText';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'reasonForSupporting8by8';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'lastUpdatedAt';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'TranslatedPartnerDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type TranslatedRewardDetailsSnapshotFields = (
  | {
      name: 'languageCode';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'categories';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'shortDescription';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'longDescription';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'lastUpdatedAt';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'TranslatedRewardDetailsSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type TranslatedVoucherDetailsFields = (
  | {
      name: 'languageCode';
      on: 'TranslatedVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: 'voucherDetails';
      on: 'TranslatedVoucherDetails';
      alias: string;
      arguments: {};
      fields: VoucherDetailsFields;
    }
  | {
      name: '__typename';
      on: 'TranslatedVoucherDetails';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type VoucherFields = (
  | {
      name: 'translatedDetails';
      on: 'Voucher';
      alias: string;
      arguments: {
        languageCodes?: LanguageCode[];
      };
      fields: TranslatedVoucherDetailsFields;
    }
  | {
      name: 'expirationDate';
      on: 'Voucher';
      alias: string;
      arguments: {};
      fields: never;
    }
  | {
      name: '__typename';
      on: 'Voucher';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export type VoucherDetailsFields = Flatten<
  [
    (
      | {
          name: 'redemptionMethod';
          on: 'VoucherDetails';
          alias: string;
          arguments: {};
          fields: never;
        }
      | {
          name: 'instructions';
          on: 'VoucherDetails';
          alias: string;
          arguments: {};
          fields: never;
        }
      | {
          name: '__typename';
          on: 'VoucherDetails';
          alias: string;
          arguments: {};
          fields: never;
        }
    )[],
    CodeVoucherDetailsFields,
    LinkVoucherDetailsFields,
    ManualVoucherDetailsFields,
    QRCodeVoucherDetailsFields,
  ]
>;

export type VoucherWithRewardSnapshotFields = (
  | {
      name: 'voucher';
      on: 'VoucherWithRewardSnapshot';
      alias: string;
      arguments: {};
      fields: VoucherFields;
    }
  | {
      name: 'rewardSnapshot';
      on: 'VoucherWithRewardSnapshot';
      alias: string;
      arguments: {};
      fields: RewardSnapshotFields;
    }
  | {
      name: '__typename';
      on: 'VoucherWithRewardSnapshot';
      alias: string;
      arguments: {};
      fields: never;
    }
)[];

export const gqlarr = {
  getQueryField<T extends QueryFields[number]['name']>(
    info: GraphQLResolveInfo,
    fieldName: T,
  ): Extract<QueryFields[number], { name: T }> | undefined {
    const node = info.fieldNodes
      .find(node => node.name.value === 'Query')
      ?.selectionSet?.selections.find(node =>
        isFieldNodeWithName(node, fieldName),
      );

    if (!node) return undefined;

    return extractField<Extract<QueryFields[number], { name: T }>>(
      node,
      'Query',
      info,
    );
  },
  getMutationField<T extends MutationFields[number]['name']>(
    info: GraphQLResolveInfo,
    fieldName: T,
  ): Extract<MutationFields[number], { name: T }> | undefined {
    const node = info.fieldNodes
      .find(node => node.name.value === 'Mutation')
      ?.selectionSet?.selections.find(node =>
        isFieldNodeWithName(node, fieldName),
      );

    if (!node) return undefined;

    return extractField<Extract<MutationFields[number], { name: T }>>(
      node,
      'Mutation',
      info,
    );
  },
};

interface Field {
  name: string;
  on: string;
  alias: string;
  arguments: Record<string, unknown>;
  fields: Field[];
}

function isFieldNodeWithName(
  node: SelectionNode,
  name: string,
): node is FieldNode {
  return node.kind === Kind.FIELD && node.name.value === name;
}

function extractField<T extends Field>(
  node: FieldNode,
  on: string,
  info: GraphQLResolveInfo,
) {
  return {
    name: node.name.value,
    alias: node.alias?.value ?? node.name.value,
    on,
    arguments: Object.fromEntries(
      node.arguments?.map(arg => [
        arg.name.value,
        valueFromASTUntyped(arg.value, info.variableValues),
      ]) ?? [],
    ),
    fields:
      node.selectionSet?.selections.flatMap(selectionNode =>
        extractFields(selectionNode, node.name.value, info),
      ) ?? [],
  } as T;
}

function extractFields<T extends Field[]>(
  node: SelectionNode,
  typeCondition: string,
  info: GraphQLResolveInfo,
): T {
  if (node.kind === Kind.FRAGMENT_SPREAD) {
    const fragment = info.fragments[node.name.value];
    if (fragment) {
      return fragment.selectionSet.selections.flatMap(selectionNode =>
        extractFields(selectionNode, fragment.typeCondition.name.value, info),
      ) as T;
    } else return [] as unknown as T;
  } else if (node.kind === Kind.INLINE_FRAGMENT) {
    return node.selectionSet.selections.flatMap(selectionNode =>
      extractFields(
        selectionNode,
        node.typeCondition?.name.value ?? typeCondition,
        info,
      ),
    ) as T;
  } else {
    return [
      {
        name: node.name.value,
        alias: node.alias?.value ?? node.name.value,
        on: typeCondition,
        arguments: Object.fromEntries(
          node.arguments?.map(arg => [
            arg.name.value,
            valueFromASTUntyped(arg.value, info.variableValues),
          ]) ?? [],
        ),
        fields:
          node.selectionSet?.selections.flatMap(selectionNode =>
            extractFields(selectionNode, node.name.value, info),
          ) ?? [],
      },
    ] as T;
  }
}
