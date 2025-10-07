/* eslint-disable react/prop-types */
import { usePermissions } from '../context/PermissionContext';

const Can = ({ page, action, children, fallback = null, showAlert = false }) => {
    const { checkPermission, performActionWithPermission } = usePermissions();

    const isAllowed = checkPermission(page, action);

    if (showAlert) {
        // যদি showAlert true হয়, তাহলে একটি বাটন রেন্ডার করুন যা ক্লিক করলে পারমিশন চেক করবে
        return (
            <div onClick={() => performActionWithPermission(
                page,
                action,
                () => { },
                `You don't have permission to ${action} this item.`
            )}>
                {children}
            </div>
        );
    }

    // সাধারণ ক্ষেত্রে, পারমিশন থাকলে children রেন্ডার করুন
    return isAllowed ? <>{children}</> : <>{fallback}</>;
};

export default Can;