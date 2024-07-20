import { ThrowError, SaveAuditTrail, log } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllAssetCategories(_, { company_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAllAssetCategories'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      try {
        const query = `SELECT * FROM fixed_asset_categories WHERE company_id = :company_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAllAssetCategories Query Error', error);
        ThrowError('Failed to fetch all asset categories.');
      }
    },

    async getAllAssetsItems(_, { company_id, status, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAllAssetsItems'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      if (!Validate.string(status)) { ThrowError('Invalid status'); }

      try {
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, status, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAllAssetsItems Query Error', error);
        ThrowError('Failed to fetch all assets items.');
      }
    },

    async getAssetsByCategory(_, { company_id, status, category_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAssetsByCategory'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      try {
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND category_id = :category_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, status, category_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAssetsByCategory Query Error', error);
        ThrowError('Failed to fetch assets by category.');
      }
    },

    async getAssetsByLocation(_, { company_id, status, location_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAssetsByLocation'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      try {
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND location_id = :location_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, status, location_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAssetsByLocation Query Error', error);
        ThrowError('Failed to fetch assets by location.');
      }
    },

    async getAssetsByVendor(_, { company_id, status, vendor_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAssetsByVendor'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      try {
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND vendor_id = :vendor_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, status, vendor_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAssetsByVendor Query Error', error);
        ThrowError('Failed to fetch assets by vendor.');
      }
    },

    async getAssetsByPurchaseDate(_, { company_id, status, purchase_date_start, purchase_date_end, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAssetsByPurchaseDate'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.date(purchase_date_start) || !Validate.date(purchase_date_end)) { ThrowError('Invalid purchase date'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      try {
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND purchase_date BETWEEN :purchase_date_start AND :purchase_date_end LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, status, purchase_date_start, purchase_date_end, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAssetsByPurchaseDate Query Error', error);
        ThrowError('Failed to fetch assets by purchase date.');
      }
    },

    async getAssetDepreciation(_, { company_id, asset_id, offset }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['getAssetDepreciation'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.positiveInteger(company_id)) { ThrowError('Invalid company'); }

      if (!Validate.integer(asset_id)) { ThrowError('Invalid asset ID'); }

      if (!Validate.integer(offset)) { ThrowError('Invalid offset'); }

      try {
        const query = `SELECT * FROM fixed_assets_depreciation WHERE company_id = :company_id AND item_id = :asset_id LIMIT :limit OFFSET :offset`;
        return await DBObject.findDirect(query, { company_id, asset_id, limit: CONFIG.settings.PAGINATION_LIMIT, offset });
      } catch (error) {
        log('getAssetDepreciation Query Error', error);
        ThrowError('Failed to fetch asset depreciation.');
      }
    }
  },

  Mutation: {
    async createAssetCategory(_, { company_id, name, description, depreciation_method, useful_life_years, salvage_value }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createAssetCategory'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.string(name)) { ThrowError('Invalid category name.'); }
      if (!Validate.integer(useful_life_years)) { ThrowError('Invalid useful life years.'); }
      if (!Validate.float(salvage_value)) { ThrowError('Invalid salvage value.'); }

      try {
        const categoryData = { company_id, name, description, depreciation_method, useful_life_years, salvage_value };
        const categoryId = await DBObject.insertOne('fixed_asset_categories', categoryData);

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "createAssetCategory",
          details: `Created asset category: ${name}`,
        });

        return { id: categoryId, ...categoryData };
      } catch (error) {
        log('createAssetCategory Mutation Error', error);
        ThrowError('Failed to create asset category.');
      }
    },

    async updateAssetCategory(_, { id, company_id, name, description, depreciation_method, useful_life_years, salvage_value }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateAssetCategory'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid asset category ID.'); }
      if (!Validate.string(name)) { ThrowError('Invalid category name.'); }
      if (!Validate.integer(useful_life_years)) { ThrowError('Invalid useful life years.'); }
      if (!Validate.float(salvage_value)) { ThrowError('Invalid salvage value.'); }

      try {
        const updateData = { name, description, depreciation_method, useful_life_years, salvage_value, updated_at: new Date() };
        await DBObject.updateOne('fixed_asset_categories', updateData, { id });

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "updateAssetCategory",
          details: `Updated asset category ID: ${id}`,
        });

        return id;
      } catch (error) {
        log('updateAssetCategory Mutation Error', error);
        ThrowError('Failed to update asset category.');
      }
    },

    async deleteAssetCategory(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteAssetCategory'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid asset category ID.'); }

      try {
        await DBObject.deleteOne('fixed_asset_categories', { id });

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "deleteAssetCategory",
          details: `Deleted asset category ID: ${id}`,
        });

        return id;
      } catch (error) {
        log('deleteAssetCategory Mutation Error', error);
        ThrowError('Failed to delete asset category.');
      }
    },

    async createAssetItem(_, { company_id, branch_id, vendor_id, location_id, category_id, tag, serial_number, name, description, purchase_date, purchase_cost, latest_value, status }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['createAssetItem'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.string(name)) { ThrowError('Invalid asset item name.'); }
      if (!Validate.float(purchase_cost)) { ThrowError('Invalid purchase cost.'); }
      if (!Validate.float(latest_value)) { ThrowError('Invalid latest value.'); }

      try {
        const itemData = { company_id, branch_id, vendor_id, location_id, category_id, tag, serial_number, name, description, purchase_date, purchase_cost, latest_value, status };
        const itemId = await DBObject.insertOne('fixed_assets_items', itemData);

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "createAssetItem",
          details: `Created asset item: ${name}`,
        });

        return { id: itemId, ...itemData };
      } catch (error) {
        log('createAssetItem Mutation Error', error);
        ThrowError('Failed to create asset item.');
      }
    },

    async updateAssetItem(_, { id, company_id, branch_id, vendor_id, location_id, category_id, tag, serial_number, name, description, purchase_date, purchase_cost, latest_value, status }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['updateAssetItem'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid asset ID.'); }

      try {
        const updateData = { company_id, branch_id, vendor_id, location_id, category_id, tag, serial_number, name, description, purchase_date, purchase_cost, latest_value, status, updated_at: new Date() };
        await DBObject.updateOne('fixed_assets_items', updateData, { id });

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "updateAssetItem",
          details: `Updated asset item ID: ${id}`,
        });

        return id;
      } catch (error) {
        log('updateAssetItem Mutation Error', error);
        ThrowError('Failed to update asset item.');
      }
    },

    async deleteAssetItem(_, { id, company_id }, context) {
      const isAllowed = hasPermission({ context, company_id, tasks: ['deleteAssetItem'] });
      if (!isAllowed) { ThrowError('#NOACCESS'); }

      if (!Validate.integer(id)) { ThrowError('Invalid asset ID.'); }

      try {
        await DBObject.deleteOne('fixed_assets_items', { id });

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          email: context.email,
          task: "deleteAssetItem",
          details: `Deleted asset item ID: ${id}`,
        });

        return id;
      } catch (error) {
        log('deleteAssetItem Mutation Error', error);
        ThrowError('Failed to delete asset item.');
      }
    },
  },
};
