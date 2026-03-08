import type { Point } from '../../point';

import { sql, type Expression, type RawBuilder, type Generated } from "kysely";

export interface DB {
  "public.base_entity": {
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  "public.base_voucher": {
    created_at: Generated<Date>;
    redeemable_until: Date;
    updated_at: Generated<Date>;
  };
  "public.base_voucher_stub": {
    created_at: Generated<Date>;
    redeemable_for: string;
    redeemable_until_exact: Date;
    redeemable_until_local: Date;
    updated_at: Generated<Date>;
    vouchers_remaining: number;
  };
  "public.category": {
    created_at: Generated<Date>;
    id: Generated<number>;
    updated_at: Generated<Date>;
  };
  "public.category_translation": {
    category_id: number;
    category_name: string;
    created_at: Generated<Date>;
    language_code: string;
    updated_at: Generated<Date>;
  };
  "public.code_based_voucher_value": {
    created_at: Generated<Date>;
    id: Generated<string>;
    multiple_use_voucher_id: number;
    redemption_code: string;
    single_use_voucher_id: string;
    updated_at: Generated<Date>;
  };
  "public.code_based_voucher_value_details_translation": {
    code_based_voucher_value_id: string;
    created_at: Generated<Date>;
    instructions: string;
    language_code: string;
    updated_at: Generated<Date>;
  };
  "public.language": {
    created_at: Generated<Date>;
    language_code: string;
    language_name: string;
    updated_at: Generated<Date>;
  };
  "public.link_based_voucher_value": {
    created_at: Generated<Date>;
    id: Generated<string>;
    multiple_use_voucher_id: number;
    single_use_voucher_id: string;
    updated_at: Generated<Date>;
  };
  "public.link_based_voucher_value_details_translation": {
    created_at: Generated<Date>;
    instructions: string;
    language_code: string;
    link_based_voucher_value_id: string;
    redemption_link_text: string;
    redemption_link_url: string;
    updated_at: Generated<Date>;
  };
  "public.location": {
    coordinates: Point;
    created_at: Generated<Date>;
    id: Generated<string>;
    partner_id: number;
    updated_at: Generated<Date>;
  };
  "public.manual_voucher_stub": {
    created_at: Generated<Date>;
    id: Generated<number>;
    redeemable_for: string;
    redeemable_until_exact: Date;
    redeemable_until_local: Date;
    reward_id: string;
    updated_at: Generated<Date>;
    vouchers_remaining: number;
  };
  "public.manual_voucher_stub_details_translation": {
    created_at: Generated<Date>;
    instructions: string;
    language_code: string;
    manual_voucher_stub_id: number;
    updated_at: Generated<Date>;
  };
  "public.multiple_use_voucher": {
    created_at: Generated<Date>;
    has_usage_cap: boolean;
    id: Generated<number>;
    redeemable_until: Date;
    reward_id: string;
    updated_at: Generated<Date>;
  };
  "public.on_demand_voucher_stub": {
    created_at: Generated<Date>;
    id: Generated<number>;
    redeemable_for: string;
    redeemable_until_exact: Date;
    redeemable_until_local: Date;
    reward_id: string;
    updated_at: Generated<Date>;
    vouchers_remaining: number;
  };
  "public.partner": {
    created_at: Generated<Date>;
    id: Generated<number>;
    updated_at: Generated<Date>;
  };
  "public.partner_details_translation": {
    created_at: Generated<Date>;
    description: string;
    language_code: string;
    logo_url: string;
    name: string;
    partner_id: number;
    reason_for_supporting_8by8: string;
    updated_at: Generated<Date>;
    web_address_text: string;
    web_address_url: string;
  };
  "public.qr_code_based_voucher_value": {
    created_at: Generated<Date>;
    id: Generated<string>;
    multiple_use_voucher_id: number;
    redemption_qr_code: string;
    single_use_voucher_id: string;
    updated_at: Generated<Date>;
  };
  "public.qr_code_based_voucher_value_details_translation": {
    created_at: Generated<Date>;
    instructions: string;
    language_code: string;
    qr_code_based_voucher_value_id: string;
    updated_at: Generated<Date>;
  };
  "public.reward": {
    available_from_exact: Date;
    available_from_local: Date;
    available_until_exact: Date;
    available_until_local: Date;
    created_at: Generated<Date>;
    id: Generated<string>;
    partner_id: number;
    redemption_forums: ("ONLINE" | "IN_STORE")[];
    updated_at: Generated<Date>;
    voucher_type: "MULTIPLE_USE" | "SINGLE_USE" | "ON_DEMAND" | "MANUAL";
  };
  "public.reward_category": {
    category_id: number;
    created_at: Generated<Date>;
    reward_id: string;
    updated_at: Generated<Date>;
  };
  "public.reward_details_translation": {
    created_at: Generated<Date>;
    language_code: string;
    long_description: string;
    reward_id: string;
    short_description: string;
    updated_at: Generated<Date>;
  };
  "public.single_use_voucher": {
    created_at: Generated<Date>;
    id: Generated<string>;
    redeemable_until: Date;
    reward_id: string;
    updated_at: Generated<Date>;
  };
}

type PgFnNames =
  | "pg_catalog.jsonb_build_object"
  | "public.calc_distance_with_units"
  | "public.convert_distance"
  | "public.get_latitude"
  | "public.get_longitude"
  | "public.make_geographic_point"
  | "public.st_dwithin";

type PgFnParams<T extends PgFnNames> = T extends "pg_catalog.jsonb_build_object"
  ? [] | [...Expression<string>[]]
  : T extends "public.calc_distance_with_units"
    ? [
        Expression<Point>,
        Expression<Point>,
        Expression<"METERS" | "KILOMETERS" | "MILES">,
      ]
    : T extends "public.convert_distance"
      ? [
          Expression<number>,
          Expression<"METERS" | "KILOMETERS" | "MILES">,
          Expression<"METERS" | "KILOMETERS" | "MILES">,
        ]
      : T extends "public.get_latitude"
        ? [Expression<Point>]
        : T extends "public.get_longitude"
          ? [Expression<Point>]
          : T extends "public.make_geographic_point"
            ? [Expression<number>, Expression<number>]
            : T extends "public.st_dwithin"
              ?
                  | [Expression<string>, Expression<string>, Expression<number>]
                  | [Expression<Point>, Expression<Point>, Expression<number>]
                  | [Expression<string>, Expression<string>, Expression<number>]
                  | [
                      Expression<Point>,
                      Expression<Point>,
                      Expression<number>,
                      Expression<boolean>,
                    ]
              : never;

type PgFnReturnTypes<
  T extends PgFnNames,
  V extends PgFnParams<T>,
> = T extends "pg_catalog.jsonb_build_object"
  ? V extends []
    ? object | null
    : V extends [...Expression<string>[]]
      ? object | null
      : never
  : T extends "public.calc_distance_with_units"
    ? V extends [
        Expression<Point>,
        Expression<Point>,
        Expression<"METERS" | "KILOMETERS" | "MILES">,
      ]
      ? number | null
      : never
    : T extends "public.convert_distance"
      ? V extends [
          Expression<number>,
          Expression<"METERS" | "KILOMETERS" | "MILES">,
          Expression<"METERS" | "KILOMETERS" | "MILES">,
        ]
        ? number | null
        : never
      : T extends "public.get_latitude"
        ? V extends [Expression<Point>]
          ? number | null
          : never
        : T extends "public.get_longitude"
          ? V extends [Expression<Point>]
            ? number | null
            : never
          : T extends "public.make_geographic_point"
            ? V extends [Expression<number>, Expression<number>]
              ? Point | null
              : never
            : T extends "public.st_dwithin"
              ? V extends [
                  Expression<string>,
                  Expression<string>,
                  Expression<number>,
                ]
                ? boolean | null
                : V extends [
                      Expression<Point>,
                      Expression<Point>,
                      Expression<number>,
                    ]
                  ? boolean | null
                  : V extends [
                        Expression<string>,
                        Expression<string>,
                        Expression<number>,
                      ]
                    ? boolean | null
                    : V extends [
                          Expression<Point>,
                          Expression<Point>,
                          Expression<number>,
                          Expression<boolean>,
                        ]
                      ? boolean | null
                      : never
              : never;

export function pgFn<T extends PgFnNames, V extends PgFnParams<T>>(
  fn: T,
  args: V,
): RawBuilder<PgFnReturnTypes<T, V>> {
  return sql<PgFnReturnTypes<T, V>>`${sql.raw(fn)}(${sql.join(args)})`;
}