import { headers } from "next/headers";
import { Metadata } from "next";
import { Portfolio } from "@/components/Portfolio";
import { getMetadataForPath, getAllStaticPaths } from "@/lib/seo";

interface PageProps {
  params: Promise<{ path?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path = [] } = await params;
  const { title, description } = getMetadataForPath(path);

  const url = path.length > 0 ? `https://parthg.tech/${path.join("/")}` : "https://parthg.tech";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Parth Gupta",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export async function generateStaticParams() {
  const paths = getAllStaticPaths();
  
  return paths.map(pathArray => ({
    path: pathArray.length > 0 ? pathArray : undefined,
  }));
}

export default async function Page({ params }: PageProps) {
  const { path = [] } = await params;
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // Simple mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const initialIsDesktop = !isMobile;

  return <Portfolio initialIsDesktop={initialIsDesktop} initialPath={path} />;
}
