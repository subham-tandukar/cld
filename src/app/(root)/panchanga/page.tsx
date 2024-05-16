import Panchanga from "./Panchanga";
import { Metadata, ResolvingMetadata } from "next";
import { removeHTMLTags } from "../../../hooks";


const siteSettingList = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/site-settings`, {
            cache: "no-store",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        return result
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
    const data = await siteSettingList()
    const previousImg = (await parent).openGraph?.images || []

    const title = `${data?.data?.panchanga_title_np} - Online Khabar Calendar`
    const description = removeHTMLTags(data?.data?.panchanga_description_np)
    const ogTitle = `${title}`
    const imageUrl = `${data?.data?.panchanga_thumbnail ? data?.data?.panchanga_thumbnail : data?.data?.main_logo}`

    return {
        title: title ? title : "Online Khabar Calendar",
        description: description,
        openGraph: {
            title: ogTitle,
            description: description,
            images: [imageUrl, ...previousImg],
            url: `https://calendar.onlinekhabar.com/panchanga`
        },
        twitter: {
            title: ogTitle,
            description: description,
            images: [imageUrl, ...previousImg],
        },
    }
}

export default async function page() {
    return (
        <>
            <Panchanga />
        </>
    );
}