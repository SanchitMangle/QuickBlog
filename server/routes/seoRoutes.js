import express from 'express';
import Blog from '../models/blog.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt');
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${blogs.map(blog => `
    <url>
        <loc>${baseUrl}/blog/${blog.slug || blog._id}</loc>
        <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    `).join('')}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating sitemap");
    }
});

router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
    `);
});

export default router;
