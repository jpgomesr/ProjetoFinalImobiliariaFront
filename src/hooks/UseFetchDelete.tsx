import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export const UseFetchDelete = async (url: string) => {
   const session = await getServerSession(authOptions)
   return await fetch(url, {
      method: "DELETE",
      headers:{
         "Authorization" : `Bearrer ${session?.accessToken || ""}`
      }
   });
};
