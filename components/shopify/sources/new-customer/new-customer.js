const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-customer",
  name: "New Customer",
  description: "Emits an event for each new customer added to a store.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  async run() {
    const sinceId = this.db.get("since_id") || null;
    let results = await this.shopify.getCustomers(sinceId);

    for (const customer of results) {
      this.$emit(customer, {
        id: customer.id,
        summary: `${customer.first_name} ${customer.last_name}`,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};