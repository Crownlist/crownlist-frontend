"use client"
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { useMgtKeys } from "@/lib/useMgtKeys";
import { RootState } from "@/store";
import { updateAdminData } from "@/store/slices/admin/adminDataSlice";
import CustomLoader from "@/components/CustomLoader";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { adminData } = useSelector((state: RootState) => state.adminData);
    const { removeOrionKeys, getOrionKeys } = useMgtKeys();
    const { data} = useGetAuthUser("Admin");
    const router = useRouter()  
   console.log(adminData, data)
    useEffect(() => {
      sessionStorage.setItem("returnTo", pathname);
    }, [pathname]);

    // useEffect(() => {
    //   // const user:any = data
    //   console.log('layout', adminData)
    //   if (!data){
        
    //     location.replace(location.origin + "/auth/admin/sign-in");
    //   }
    // }, [data]);
  
    useEffect(() => {
      const checkData: any = setInterval(() => {
        const isKeyPresent = getOrionKeys();
  
        if (!isKeyPresent ) {
          removeOrionKeys();
          dispatch(updateAdminData(null));
          location.replace(location.origin + "/auth/admin/sign-in");
        }
      }, 1000);
  
      return () => clearInterval(checkData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <>
        {data ? children : <CustomLoader text="Loading admin data..." />}
      </>
    );
  }
  