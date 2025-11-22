import { headers } from "next/headers";
import { Portfolio } from "@/components/Portfolio";

export default async function Home() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  
  // Simple mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const initialIsDesktop = !isMobile;

  return <Portfolio initialIsDesktop={initialIsDesktop} />;
}