import { systemRoles } from "../../utils/system-roles.js";

export const endpoints  = {
    ADD_PRODUCT: [systemRoles.SUPER_ADMIN,systemRoles.Admin],
};
