"use client"

import React from 'react'
import { InlineShareButtons } from 'sharethis-reactjs';

const Share = ({ endpoint, title, imageUrl }) => {

    if (!title.includes("undefined")) {
        return (
            <div className="ok-share">
                <div>
                    <InlineShareButtons
                        config={{
                            alignment: "left", // alignment of buttons (left, right)
                            color: "social", // set the color of buttons (social, white)
                            enabled: true, // show/hide buttons (true, false)
                            font_size: 16, // font size for the buttons

                            labels: "counts", // button labels (cta, counts, null)
                            language: "en", // which language to use (see LANGUAGES)
                            networks: [
                                // which networks to include (see SHARING NETWORKS)
                                "facebook",
                                "messenger",
                                "twitter",
                                "whatsapp",
                                // "sharethis"
                            ],
                            padding: 12, // padding within buttons (INTEGER)
                            radius: 4, // the corner radius on each button (INTEGER)
                            show_total: true, // show/hide the total share count (true, false)
                            size: 45, // the size of each button (INTEGER)
                            // OPTIONAL PARAMETERS
                            url: `https://calendar.onlinekhabar.com/${endpoint}`, // (defaults to current url)
                            title: `${title}`,
                            image: imageUrl, // (defaults to og:image or twitter:image)
                        }}
                    />
                </div>
            </div>
        )
    }


}

export default Share