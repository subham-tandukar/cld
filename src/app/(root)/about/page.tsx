import { removeHTMLTags } from "../../../hooks";
import About from "./About";
import { Metadata, ResolvingMetadata } from "next";


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

    const title = `${data?.data?.about_title_np || "अनलाइन क्यालेन्डर"} - Online Khabar Calendar`
    const description = data?.data?.footer_text_np && removeHTMLTags(data?.data?.footer_text_np)
    const ogTitle = `${title}`
    const imageUrl = `${data?.data?.about_thumbnail ? data?.data?.about_thumbnail : data?.data?.main_logo}`

    return {
        title: title ? title : "Online Khabar Calendar",
        description: description,
        openGraph: {
            title: ogTitle,
            description: description,
            images: [imageUrl, ...previousImg],
            url: `https://calendar.onlinekhabar.com/about`
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
            <About />
        </>
    );
}