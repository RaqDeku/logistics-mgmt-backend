"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOnHoldEvent = void 0;
const types_1 = require("./types");
class OrderOnHoldEvent extends types_1.OrderDetails {
    reason;
    notes;
    duration;
}
exports.OrderOnHoldEvent = OrderOnHoldEvent;
//# sourceMappingURL=order-on-hold.event.js.map