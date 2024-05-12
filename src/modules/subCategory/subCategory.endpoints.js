import { systemRoles } from "../../utils/system-roles.js";

export const endpoints  = {
    ADD_CATEGORY: [systemRoles.SUPER_ADMIN],
    UPDATE_CATEGORY: [systemRoles.SUPER_ADMIN],
};
