import { notFound } from "next/navigation";
import PlaceholderPage from "@/components/dashboard/Placeholder";
import { placeholderRoutes } from "@/data";


export default function DynamicDashboardPage({ params }: {
    params: { slug: string[] } })  {
    
    const path = params.slug.join("/")

    if (placeholderRoutes.includes(path)) {
        return <PlaceholderPage />;
    }

    return notFound();
}