"use client"
import CustomLoader from "@/components/CustomLoader";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { useMgtKeys } from "@/lib/useMgtKeys";
import { RootState } from "@/store";
import { updateUserData } from "@/store/slices/user/userDataSlice";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function BuyerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.userData);
  const { removeLeoKeys, getLeoKeys } = useMgtKeys();
  const { data } = useGetAuthUser("User");
  const router = useRouter()   
  useEffect(() => {
    sessionStorage.setItem("returnUserTo", pathname);
  }, [pathname]);

  useEffect(() => {
    const user = data?.data.loggedInAccount.accountType
    console.log('layout', user)
    if (user == "Seller"){
      router.push('/seller/dashboard')
    }
  }, [data]);

  useEffect(() => {
    const checkData: any = setInterval(() => {
      const isKeyPresent = getLeoKeys();

      if (!isKeyPresent) {
        removeLeoKeys();
        dispatch(updateUserData(null));
        location.replace(location.origin + "/auth/login");
      }
    }, 1000);

    return () => clearInterval(checkData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(userData)
  return (
    <>
      {userData ? children : <CustomLoader text="Loading data..." />}
       
    
    </>
  );
}
