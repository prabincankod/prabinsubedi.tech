import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";



// Cache fonts for performance
let cachedFonts: { regular: Buffer; bold: Buffer; medium: Buffer } | null = null;

async function loadFonts() {
    if (cachedFonts) return cachedFonts;

    const fontDir = path.resolve("src/assets/fonts");

    cachedFonts = {
        regular: await fs.readFile(path.join(fontDir, "DMSans-Regular.ttf")),
        bold: await fs.readFile(path.join(fontDir, "DMSans-Bold.ttf")),
        medium: await fs.readFile(path.join(fontDir, "DMSans-Medium.ttf")), // footer
    };

    return cachedFonts;
}

export const GET: APIRoute = async ({ params }) => {
    const posts = await getCollection("post");
    const post = posts.find((p) => p.id === params.post);

    if (!post) return new Response("Post not found", { status: 404 });

    const { title, description, date } = post.data;
    const fonts = await loadFonts();

    // Load avatar/logo
    const avatarPath = path.resolve("src/assets/logo.png"); // 100px tall PNG
    const avatarBuffer = await fs.readFile(avatarPath);
    const avatarBase64 = avatarBuffer.toString("base64");

    // Create a data URL
    const dataURL = `data:image/png;base64,${avatarBase64}`;

    // Generate SVG via Satori
    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "1200px",
                    height: "630px",
                    backgroundColor: "#ffffff",
                    fontFamily: "DM Sans",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 60,
                    position: "relative",
                    border: "1px solid #000000", // subtle border
                },
                children: [
                    // Avatar/logo top center
                    {
                        type: "img",
                        props: {
                            src: dataURL, // placeholder, will overlay via sharp
                            width: 160,
                            height: 160,
                            style: {
                                marginBottom: 20,
                            },
                        },
                    },
                    // Title
                    {
                        type: "div",
                        props: {
                            style: {
                                fontSize: 64,
                                fontWeight: 700,
                                color: "#000000",
                                textAlign: "center",
                                lineHeight: 1.2,
                                marginBottom: 20,
                                maxWidth: "100%",
                            },
                            children: title,
                        },
                    },
                    // Description
                    {
                        type: "div",
                        props: {
                            style: {
                                fontSize: 28,
                                fontWeight: 400,
                                color: "#4b5563",
                                textAlign: "center",
                                maxWidth: "80%",
                                lineHeight: 1.4,
                            },
                            children: description,
                        },
                    },
                    // Footer container
                    {
                        type: "div",
                        props: {
                            style: {
                                position: "absolute",
                                bottom: 40,
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0 60px",
                                fontSize: 18,
                                fontWeight: 500,
                                color: "#000000",
                            },
                            children: [
                                { type: "div", props: { children: "prabinsubedi.tech" } },
                                { type: "div", props: { children: new Date(date).toLocaleDateString("en-US") } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: "DM Sans", data: fonts.regular, weight: 400, style: "normal" },
                { name: "DM Sans", data: fonts.bold, weight: 700, style: "normal" },
                { name: "DM Sans", data: fonts.medium, weight: 500, style: "normal" },
            ],
        }
    );

    // Convert SVG → WEBP via Sharp
    let baseImage = sharp(Buffer.from(svg)).webp();


    const pngBuffer = await baseImage
        .webp()
        .toBuffer();

    return new Response(pngBuffer, {
        headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};

export async function getStaticPaths() {
    const posts = await getCollection("post");
    return posts.map((post) => ({ params: { post: post.id } }));
}
