import { Metadata, ResolvingMetadata } from "next";
import Holiday from "./Holiday";
import { removeHTMLTags } from "../../../hooks";


async function getItem() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/today`, {
            cache: "no-store"
        });
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        return result
    } catch (error) {
        console.error("Error fetching data:", error);
        return { data: null, time: null };
    }
}



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

    const title = `${data?.data?.holidays_title_np} - Online Khabar Calendar`
    const description = removeHTMLTags(data?.data?.holidays_description_np)
    const ogTitle = `${title}`
    const imageUrl = `${data?.data?.holidays_thumbnail ? data?.data?.holidays_thumbnail : data?.data?.main_logo}`

    return {
        title: title ? title : "Online Khabar Calendar",
        description: description,
        openGraph: {
            title: ogTitle,
            description: description,
            images: [imageUrl, ...previousImg],
            url: `https://calendar.onlinekhabar.com/holiday`
        },
        twitter: {
            title: ogTitle,
            description: description,
            images: [imageUrl, ...previousImg],
        },
    }
}

export default async function page() {
    const { data, time } = await getItem();
    return (
        <>
            <Holiday currentdate={data} />
        </>
    );
}