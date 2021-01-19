'use strict';

/**
 * Lifecycle callbacks for the `game` model.
 */

module.exports = {
  lifecycles: {
    // Before saving a value.
    // Fired before an `insert` or `update` query.
    // beforeSave: async (model, attrs, options) => {},

    // After saving a value.
    // Fired after an `insert` or `update` query.
    // afterSave: async (model, response, options) => {},

    // Before fetching a value.
    // Fired before a `fetch` operation.
    // beforeFetch: async (model, columns, options) => {},

    // After fetching a value.
    // Fired after a `fetch` operation.
    // afterFetch: async (model, response, options) => {},

    // Before fetching all values.
    // Fired before a `fetchAll` operation.
    // beforeFetchAll: async (model, columns, options) => {},

    // After fetching all values.
    // Fired after a `fetchAll` operation.
    // afterFetchAll: async (model, response, options) => {},

    // Before creating a value.
    // Fired before an `insert` query.
    // beforeCreate: async (model, attrs, options) => {},

    // After creating a value.
    // Fired after an `insert` query.
    // afterCreate: async (model, attrs, options) => {},

    // Before updating a value.
    // Fired before an `update` query.
    // beforeUpdate: async (model, attrs, options) => {},

    // After updating a value.
    // Fired after an `update` query.
    // afterUpdate: async (model, attrs, options) => {},

    // Before destroying a value.
    // Fired before a `delete` query.
    // beforeDestroy: async (model, attrs, options) => { }

    // After destroying a value.
    // Fired after a `delete` query.
    afterDelete: async (/* model, attrs , options */) => {
      strapi
        .query('deck')
        .model.query((qb) => qb.whereNull('game'))
        .destroy();
      strapi
        .query('container')
        .model.query((qb) => qb.whereNull('game'))
        .destroy();
      strapi
        .query('cards')
        .model.query((qb) => qb.whereNull('game'))
        .destroy();
      strapi
        .query('permission')
        .model.query((qb) => qb.where('isBasePerm', false).whereNull('game'))
        .destroy();
      strapi
        .query('player')
        .model.query((qb) => qb.whereNull('game'))
        .destroy();
    },
  },
};
