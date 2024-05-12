import { systemRoles } from "../../utils/system-roles.js";

export const endpoints  = {
    ADD_COUPON: [systemRoles.SUPER_ADMIN,systemRoles.Admin],
};
