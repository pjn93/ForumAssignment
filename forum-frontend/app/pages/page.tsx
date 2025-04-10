"use client";

import { useEffect } from "react";
import { getCookie } from "@/app/utils/cookie.utils";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {  setUser } from "@/app/redux/slice/userSlice";
import { Box, Button, Typography } from "@mui/material";
import ViewForum from "./forum/viewForum/page";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);
   console.log(user?.name, 'log');
   const name= user?.name || "User";
  const router = useRouter();

  // Redirect to login if no token is found
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null)); // if using Redux
    router.replace("/login"); // or your login route
  };


  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" boxShadow={2} p={1}> 
      <Typography variant="h6">{name}</Typography>

        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <ViewForum />
    </Box>
  );
}
