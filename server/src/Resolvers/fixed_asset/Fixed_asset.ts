import { ThrowError, SaveAuditTrail, log } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import hasPermission from "../../Helpers/hasPermission.js";
import CONFIG from "../../config/config.js";

export default {
  Query: {
    async getAllAssetCategories(_, { company_id, offset }, context) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAllAssetCategories"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_asset_categories WHERE company_id = :company_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id
        });
      } catch (error) {
        log("getAllAssetCategories Query Error", error);
        ThrowError("Failed to fetch all asset categories.");
      }
    },

    async getAllAssetsItems(_, { company_id, status, offset }, context) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAllAssetsItems"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      if (!Validate.string(status)) {
        ThrowError("Invalid status");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          status
        });
      } catch (error) {
        log("getAllAssetsItems Query Error", error);
        ThrowError("Failed to fetch all assets items.");
      }
    },

    async getAssetsByCategory(
      _,
      { company_id, status, category_id, offset },
      context
    ) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAssetsByCategory"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND category_id = :category_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          status,
          category_id
        });
      } catch (error) {
        log("getAssetsByCategory Query Error", error);
        ThrowError("Failed to fetch assets by category.");
      }
    },

    async getAssetsByLocation(
      _,
      { company_id, status, location_id, offset },
      context
    ) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAssetsByLocation"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND location_id = :location_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          status,
          location_id
        });
      } catch (error) {
        log("getAssetsByLocation Query Error", error);
        ThrowError("Failed to fetch assets by location.");
      }
    },

    async getAssetsByVendor(
      _,
      { company_id, status, vendor_id, offset },
      context
    ) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAssetsByVendor"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND vendor_id = :vendor_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          status,
          vendor_id
        });
      } catch (error) {
        log("getAssetsByVendor Query Error", error);
        ThrowError("Failed to fetch assets by vendor.");
      }
    },

    async getAssetsByPurchaseDate(
      _,
      { company_id, status, purchase_date_start, purchase_date_end, offset },
      context
    ) {
      if(!context.id){
        ThrowError("#RELOGIN")
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAssetsByPurchaseDate"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (
        !Validate.date(purchase_date_start) ||
        !Validate.date(purchase_date_end)
      ) {
        ThrowError("Invalid purchase date");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_items WHERE company_id = :company_id AND status = :status AND purchase_date BETWEEN :purchase_date_start AND :purchase_date_end LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          status,
          purchase_date_start,
          purchase_date_end
        });
      } catch (error) {
        log("getAssetsByPurchaseDate Query Error", error);
        ThrowError("Failed to fetch assets by purchase date.");
      }
    },

    async getAssetDepreciation(_, { company_id, asset_id, offset }, context) {
      if(!context.id){
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["getAssetDepreciation"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.positiveInteger(company_id)) {
        ThrowError("Invalid company");
      }

      if (!Validate.integer(asset_id)) {
        ThrowError("Invalid asset ID");
      }

      if (!Validate.integer(offset)) {
        ThrowError("Invalid offset");
      }

      try {
        offset = offset * CONFIG.settings.PAGINATION_LIMIT;
        const query = `SELECT * FROM fixed_assets_depreciation WHERE company_id = :company_id AND item_id = :asset_id LIMIT ${CONFIG.settings.PAGINATION_LIMIT} OFFSET ${offset}`;
        return await DBObject.findDirect(query, {
          company_id,
          asset_id
        });
      } catch (error) {
        log("getAssetDepreciation Query Error", error);
        ThrowError("Failed to fetch asset depreciation.");
      }
    },
  },

  Mutation: {
    async createAssetCategory(
      _,
      {
        company_id,
        name,
        description,
        depreciation_method,
        useful_life_years,
        salvage_value,
      },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createAssetCategory"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid category name.");
      }
      if (!Validate.integer(useful_life_years)) {
        ThrowError("Invalid useful life years.");
      }
      if (!Validate.float(salvage_value)) {
        ThrowError("Invalid salvage value.");
      }

      try {
        const categoryData = {
          company_id,
          name,
          description,
          depreciation_method,
          useful_life_years,
          salvage_value,
        };
        const categoryId = await DBObject.insertOne(
          "fixed_asset_categories",
          categoryData
        );

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "createAssetCategory",
          details: `Created asset category: ${name}`,
        });

        return { id: categoryId, ...categoryData };
      } catch (error) {
        ;
        log("createAssetCategory Mutation Error", error);
        ThrowError("Failed to create asset category.");
      }
    },

    async updateAssetCategory(
      _,
      {
        id,
        company_id,
        name,
        description,
        depreciation_method,
        useful_life_years,
        salvage_value,
      },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateAssetCategory"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(id)) {
        ThrowError("Invalid asset category ID.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid category name.");
      }
      if (!Validate.integer(useful_life_years)) {
        ThrowError("Invalid useful life years.");
      }
      if (!Validate.float(salvage_value)) {
        ThrowError("Invalid salvage value.");
      }

      try {
        const updateData = {
          name,
          description,
          depreciation_method,
          useful_life_years,
          salvage_value,
          updated_at: new Date(),
        };
        let updated = await DBObject.updateOne(
          "fixed_asset_categories",
          updateData,
          { id }
        );
        if (!Validate.positiveInteger(updated)) {
          ThrowError("Failed to update asset category.");
        }
        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "updateAssetCategory",
          details: `Updated asset category ID: ${id}`,
        });

        return await DBObject.findOne("fixed_asset_categories", { id });
      } catch (error) {
        log("updateAssetCategory Mutation Error", error);
        ThrowError("Failed to update asset category.");
      }
    },

    async deleteAssetCategory(_, { id, company_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteAssetCategory"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(id)) {
        ThrowError("Invalid asset category ID.");
      }

      try {
        let deleted = await DBObject.deleteOne("fixed_asset_categories", {
          id,
        });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete asset category.");
        }
        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "deleteAssetCategory",
          details: `Deleted asset category ID: ${id}`,
        });

        return deleted;
      } catch (error) {
        log("deleteAssetCategory Mutation Error", error);
        ThrowError("Failed to delete asset category.");
      }
    },

    async createAssetItem(
      _,
      {
        company_id,
        branch_id,
        vendor_id,
        location_id,
        category_id,
        tag,
        serial_number,
        name,
        description,
        purchase_date,
        purchase_cost,
        latest_value,
        status,
      },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["createAssetItem"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.string(name)) {
        ThrowError("Invalid asset item name.");
      }
      if (!Validate.float(purchase_cost)) {
        ThrowError("Invalid purchase cost.");
      }
      if (!Validate.float(latest_value)) {
        ThrowError("Invalid latest value.");
      }
      let assetTag = await DBObject.findOne("fixed_assets_items", {
        company_id,
        tag,
      });
      if (assetTag) {
        ThrowError("Asset tag is already used.");
      }

      try {
        const itemData = {
          company_id,
          branch_id,
          vendor_id,
          location_id,
          category_id,
          tag,
          serial_number,
          name,
          description,
          purchase_date,
          purchase_cost,
          latest_value,
          status,
        };
        const itemId = await DBObject.insertOne("fixed_assets_items", itemData);

        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "createAssetItem",
          details: `Created asset item: ${name}`,
        });

        return { id: itemId, ...itemData };
      } catch (error) {
        log("createAssetItem Mutation Error", error);
        ThrowError("Failed to create asset item.");
      }
    },

    async updateAssetItem(
      _,
      {
        id,
        company_id,
        branch_id,
        vendor_id,
        location_id,
        category_id,
        tag,
        serial_number,
        name,
        description,
        purchase_date,
        purchase_cost,
        latest_value,
        status,
      },
      context
    ) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["updateAssetItem"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(id)) {
        ThrowError("Invalid asset ID.");
      }
      if (!Validate.string(name)) {
        ThrowError("Invalid asset name.");
      }
      if (!Validate.string(tag)) {
        ThrowError("Invalid asset tag.");
      }
      if (!Validate.float(purchase_cost)) {
        ThrowError("Invalid purchase cost.");
      }
      if (!Validate.float(latest_value)) {
        ThrowError("Invalid latest value.");
      }
      let asset = await DBObject.findOne("fixed_assets_items", { id });
      if (!asset) {
        ThrowError("Asset not found.");
      }
      let assetTag = await DBObject.findOne("fixed_assets_items", {
        company_id,
        tag,
      });
      if (assetTag) {
        ThrowError("Asset tag is already used.");
      }
      try {
        const updateData = {
          company_id,
          branch_id,
          vendor_id,
          location_id,
          category_id,
          tag,
          serial_number,
          name,
          description,
          purchase_date,
          purchase_cost,
          latest_value,
          status,
          updated_at: new Date(),
        };
        let updated = await DBObject.updateOne(
          "fixed_assets_items",
          updateData,
          { id }
        );
        if (!Validate.positiveInteger(updated)) {
          ThrowError("Failed to update asset item.");
        }
        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "updateAssetItem",
          details: `Updated asset item ID: ${id}`,
        });

        return await DBObject.findOne(
          "fixed_assets_items",
          { id },
          {
            columns:
              "id, company_id, branch_id, vendor_id, location_id, category_id, tag, serial_number, name, description, purchase_date, purchase_cost, latest_value, status, created_at, updated_at",
          }
        );
      } catch (error) {
        ;
        log("updateAssetItem Mutation Error", error);
        ThrowError("Failed to update asset item.");
      }
    },

    async deleteAssetItem(_, { id, company_id }, context) {
      if (!context.id) {
        ThrowError("#RELOGIN");
      }
      const isAllowed = hasPermission({
        context,
        company_id,
        tasks: ["deleteAssetItem"],
      });
      if (!isAllowed) {
        ThrowError("#NOACCESS");
      }

      if (!Validate.integer(id)) {
        ThrowError("Invalid asset ID.");
      }

      let asset = await DBObject.findOne("fixed_assets_items", { id });
      if (!asset) {
        ThrowError("Asset not found.");
      }
      try {
        let deleted = await DBObject.deleteOne("fixed_assets_items", { id });
        if (!Validate.positiveInteger(deleted)) {
          ThrowError("Failed to delete asset item.");
        }
        SaveAuditTrail({
          user_id: context.id,
          company_id,
          branch_id: 0,
          name: context.name,
          task: "deleteAssetItem",
          details: `Deleted asset item ID: ${id}`,
        });

        return deleted;
      } catch (error) {
        log("deleteAssetItem Mutation Error", error);
        ThrowError("Failed to delete asset item.");
      }
    },
  },
};
