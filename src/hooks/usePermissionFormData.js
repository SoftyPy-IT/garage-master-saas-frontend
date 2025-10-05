import { useMemo } from "react";
import { useTenantDomain } from "./useTenantDomain";
import { useGetAllUserQuery } from "../redux/api/userApi";
import { useGetAllPagesQuery } from "../redux/api/pageApi";

export const usePermissionFormData = () => {
  const { tenantDomain } = useTenantDomain();

  // Fetch users and pages
  const { data: userData, isLoading: userLoading } = useGetAllUserQuery({
    tenantDomain,
  });
  const { data: pageData, isLoading: pageLoading } = useGetAllPagesQuery({
    tenantDomain,
  });

  // Prepare formatted options
  const pageOptions = useMemo(() => {
    if (!pageData?.data) return [];
    return pageData.data.map((page) => ({
      label: page.name,
      value: page._id,
    }));
  }, [pageData?.data]);

  const userOptions = useMemo(() => {
    if (!userData?.data) return [];
    return userData.data.map((user) => ({
      label: user.name,
      value: user._id,
    }));
  }, [userData?.data]);

  return {
    tenantDomain,
    userOptions,
    pageOptions,
    userLoading,
    pageLoading,
  };
};
