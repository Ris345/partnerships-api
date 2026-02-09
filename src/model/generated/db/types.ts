export namespace Public {
  export const PGSchemaName = 'public';

  export namespace Enums {
    /** A enum that describes where a given reward can be redeemed. */
    export type RedemptionForum = |
      'online' |
      'in_store';
    
    /**
     * An enum that describes the mechanism by which a voucher will be remitted to
     * the user. Can be used to show certain types of vouchers, such as multiple-use
     * vouchers with a usage cap, to all users regardless of whether the user has
     * claimed the reward.
     */
    export type VoucherType = |
      'multiple_use' |
      'single_use' |
      'manual' |
      'on_demand';
  }

  export namespace Tables {
    /** Unique categories that can describe rewards. */
    export namespace Categories {
      export const PGTableName = 'categories';
    
      export type ColumnNames = |
        'id' |
        'category_name' |
        'created_at' |
        'updated_at';
    
      export interface RowType {
        ['id']: number;
        ['category_name']: string;
        ['created_at']: Date;
        ['updated_at']: Date;
      }
    }
    
    /** Physical locations of partners. Each partner may have zero to many locations. */
    export namespace Locations {
      export const PGTableName = 'locations';
    
      export type ColumnNames = |
        'id' |
        'partner_id' |
        'updated_at' |
        'created_at' |
        'coordinates';
    
      export interface RowType {
        ['id']: string;
        ['partner_id']: number;
        ['updated_at']: Date;
        ['created_at']: Date;
        ['coordinates']: string;
      }
    }
    
    /**
     * A table that describes vouchers that can be redeemed manually by displaying
     * an 8by8 app to an employee of a partner at one of their physical locations
     * and pressing a button in the app to flag the reward as redeemed. This process
     * should be handled by the client application. The Partnerships API merely
     * returns information about the voucher.
     *
     * Only one such voucher details object can exist for a given reward. The
     * voucher_type of the reward must be manual.
     */
    export namespace ManualVoucherDetails {
      export const PGTableName = 'manual_voucher_details';
    
      export type ColumnNames = |
        'redeemable_until' |
        'redeemable_for' |
        'vouchers_remaining' |
        'created_at' |
        'updated_at' |
        'reward_id' |
        'instructions';
    
      export interface RowType {
        ['redeemable_until']: Date | null;
        ['redeemable_for']: string | null;
        ['vouchers_remaining']: number | null;
        ['created_at']: Date;
        ['updated_at']: Date;
        ['reward_id']: string;
        ['instructions']: string;
      }
    }
    
    /**
     * A voucher that can be shared amongst all users. Only one such voucher can
     * exist for a given reward. The voucher_type of the reward must be
     * multiple_use.
     */
    export namespace MultipleUseVouchers {
      export const PGTableName = 'multiple_use_vouchers';
    
      export type ColumnNames = |
        'redeemable_until' |
        'redemption_methods' |
        'instructions' |
        'redemption_code' |
        'redemption_qr_code' |
        'redemption_link_url' |
        'redemption_link_text' |
        'created_at' |
        'updated_at' |
        'reward_id' |
        'has_usage_cap';
    
      export interface RowType {
        ['redeemable_until']: Date | null;
        ['redemption_methods']: string;
        ['instructions']: string;
        ['redemption_code']: string | null;
        ['redemption_qr_code']: string | null;
        ['redemption_link_url']: string | null;
        ['redemption_link_text']: string | null;
        ['created_at']: Date;
        ['updated_at']: Date;
        ['reward_id']: string;
        /**
         * If has_usage_cap is true, the partner has set a limit on the number of times
         * the voucher can be used.
         *
         * This type of reward should be handled as a special case, for instance, by
         * displaying its value to all users regardless of whether they have claimed
         * it.
         */
        ['has_usage_cap']: boolean;
      }
    }
    
    /**
     * A table that describes information about a voucher that is retrieved on
     * demand, such as by invoking a serverless function that calls out to an API
     * belonging to the partner.
     *
     * Only one such voucher details object can exist for a given reward. The
     * voucher_type of the reward must be on_demand.
     */
    export namespace OnDemandVoucherDetails {
      export const PGTableName = 'on_demand_voucher_details';
    
      export type ColumnNames = |
        'redeemable_until' |
        'redeemable_for' |
        'vouchers_remaining' |
        'created_at' |
        'updated_at' |
        'reward_id';
    
      export interface RowType {
        ['redeemable_until']: Date | null;
        ['redeemable_for']: string | null;
        ['vouchers_remaining']: number | null;
        ['created_at']: Date;
        ['updated_at']: Date;
        ['reward_id']: string;
      }
    }
    
    /**
     * Businesses that have partnered with 8by8 to offer rewards to users of 8by8
     * applications.
     */
    export namespace Partners {
      export const PGTableName = 'partners';
    
      export type ColumnNames = |
        'id' |
        'name' |
        'logo_url' |
        'description' |
        'website_url' |
        'website_link_text' |
        'reason_for_supporting_8by8' |
        'created_at' |
        'updated_at';
    
      export interface RowType {
        ['id']: number;
        ['name']: string;
        ['logo_url']: string;
        ['description']: string;
        ['website_url']: string | null;
        ['website_link_text']: string | null;
        ['reason_for_supporting_8by8']: string | null;
        ['created_at']: Date;
        ['updated_at']: Date;
      }
    }
    
    /**
     * A junction table that allows for a many-to-many relationship between rewards
     * and categories.
     */
    export namespace RewardCategories {
      export const PGTableName = 'reward_categories';
    
      export type ColumnNames = |
        'reward_id' |
        'category_id' |
        'created_at' |
        'updated_at';
    
      export interface RowType {
        ['reward_id']: string;
        ['category_id']: number;
        ['created_at']: Date;
        ['updated_at']: Date;
      }
    }
    
    /**
     * Rewards offered by partners. Each partner may have between zero and many
     * rewards.
     */
    export namespace Rewards {
      export const PGTableName = 'rewards';
    
      export type ColumnNames = |
        'id' |
        'partner_id' |
        'short_description' |
        'redemption_forums' |
        'voucher_type' |
        'long_description' |
        'claimable_from' |
        'claimable_until' |
        'created_at' |
        'updated_at';
    
      export interface RowType {
        ['id']: string;
        ['partner_id']: number;
        ['short_description']: string;
        ['redemption_forums']: Enums.RedemptionForum[];
        ['voucher_type']: Enums.VoucherType;
        ['long_description']: string | null;
        ['claimable_from']: Date | null;
        ['claimable_until']: Date | null;
        ['created_at']: Date;
        ['updated_at']: Date;
      }
    }
    
    /**
     * A voucher that that can be returned to one user. Once the voucher is
     * retrieved, it is deleted from the database.
     *
     * Each reward can have multiple single-use vouchers. The voucher_type for the
     * reward must be single_use.
     *
     * This type of voucher will typically be generated in batches by a partner and
     * then uploaded to the database in batches by an 8by8 team member.
     */
    export namespace SingleUseVouchers {
      export const PGTableName = 'single_use_vouchers';
    
      export type ColumnNames = |
        'redeemable_until' |
        'redemption_methods' |
        'instructions' |
        'redemption_code' |
        'redemption_qr_code' |
        'redemption_link_url' |
        'redemption_link_text' |
        'created_at' |
        'updated_at' |
        'id' |
        'reward_id';
    
      export interface RowType {
        ['redeemable_until']: Date | null;
        ['redemption_methods']: string;
        ['instructions']: string;
        ['redemption_code']: string | null;
        ['redemption_qr_code']: string | null;
        ['redemption_link_url']: string | null;
        ['redemption_link_text']: string | null;
        ['created_at']: Date;
        ['updated_at']: Date;
        ['id']: number;
        ['reward_id']: string;
      }
    }
  }
}