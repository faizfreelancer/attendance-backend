/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "/": { view: "pages/homepage" },

  "POST /api/auth/google": {
    action: "auth/login-google",
  },

  "POST /api/attendance/validasi-gps": {
    action: "attendance/validasi-gps",
  },

  "POST /api/attendance/check-in": {
    action: "attendance/check-in",
  },

  // Office routes
  "POST /api/office": "OfficeController.create",
  "GET /api/office": "OfficeController.list",
  "PUT /api/office/:id": "OfficeController.update",
  "DELETE /api/office/:id": "OfficeController.delete",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
