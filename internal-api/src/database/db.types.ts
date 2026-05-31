// Subset of the Kysely DB interface for write operations.
// Keep in sync with ../../../src/model/db/generated-types.ts —
// re-run `npm run gen-types:db` from the project root after any migration.
export interface DB {
  'public.partner': {
    id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  };
  'public.partner_details_translation': {
    partner_id: number;
    language_tag: string;
    name: string;
    description: string;
    logo_url: string;
    reason_for_supporting_8by8: string;
    web_address_text: string;
    web_address_url: string;
    created_at: Date;
    updated_at: Date;
  };
  'public.reward': {
    id: string;
    partner_id: number;
    available_from_exact: Date;
    available_from_local: Date;
    available_until_exact: Date;
    available_until_local: Date;
    redemption_forums: ('ONLINE' | 'IN_STORE')[];
    voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
    created_at: Date;
    updated_at: Date;
  };
  'public.reward_details_translation': {
    reward_id: string;
    language_tag: string;
    long_description: string;
    short_description: string;
    created_at: Date;
    updated_at: Date;
  };
  'public.reward_category': {
    reward_id: string;
    category_id: number;
    created_at: Date;
    updated_at: Date;
  };
}
