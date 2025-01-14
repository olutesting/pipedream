const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-page",
  name: "New Page",
  description: "Emits an event for each new page published.",
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
    let results = await this.shopify.getPages(sinceId);

    for (const page of results) {
      this.$emit(page, {
        id: page.id,
        summary: page.title,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};