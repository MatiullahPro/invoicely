export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://invoicely.org";

    const routes = [
        "",
        "/receipt",
        "/clients",
        "/inventory",
        "/history",
        "/ledger",
        "/tools",
        "/about",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
    }));
}
