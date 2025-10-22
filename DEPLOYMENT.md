# Deployment Guide

## GitHub Pages Deployment

This project is configured to be deployed to GitHub Pages at `https://pcollinx.github.io/heart_scan/`.

### Configuration

The project uses Vite's `base` configuration to ensure all asset paths work correctly on GitHub Pages:

```typescript
// vite.config.ts
export default defineConfig({
  base: "/heart_scan/",  // Repository name
  // ... other config
})
```

### Build for Production

```bash
npm run build
```

This will create a `dist/` folder with all production-ready files.

### Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   - Option A: Manual deployment
     ```bash
     # Push the dist folder to gh-pages branch
     git subtree push --prefix dist origin gh-pages
     ```
   
   - Option B: Use GitHub Actions (recommended)
     Create `.github/workflows/deploy.yml`:
     ```yaml
     name: Deploy to GitHub Pages
     
     on:
       push:
         branches: [main]
     
     jobs:
       build-and-deploy:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v3
           
           - name: Setup Node.js
             uses: actions/setup-node@v3
             with:
               node-version: '18'
               cache: 'npm'
           
           - name: Install dependencies
             run: npm ci
           
           - name: Build
             run: npm run build
           
           - name: Deploy to GitHub Pages
             uses: peaceiris/actions-gh-pages@v3
             with:
               github_token: ${{ secrets.GITHUB_TOKEN }}
               publish_dir: ./dist
     ```

3. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` (or main if using gh-pages action)
   - Folder: `/` (root)

### Important Notes

#### Asset Paths
All asset paths are automatically prefixed with `/heart_scan/`:
- CSS: `/heart_scan/assets/main-[hash].css`
- JS: `/heart_scan/assets/main-[hash].js`
- Images: `/heart_scan/assets/[name]-[hash].[ext]`

#### Navigation Links
Use relative paths for navigation between pages:
```html
<!-- ✅ Correct -->
<a href="src/pages/about.html">About</a>

<!-- ❌ Incorrect -->
<a href="/src/pages/about.html">About</a>
```

#### Component Loading
The base path is automatically applied to component fetches:
```javascript
const basePath = import.meta.env.BASE_URL; // "/heart_scan/"
loadComponent("navbar", `${basePath}src/components/navbar.html`);
```

### Testing Locally

To test the production build with the correct base path:

```bash
npm run build
npm run preview
```

Then navigate to: `http://localhost:4173/heart_scan/`

**Note**: The base path is important when testing locally to ensure all paths work correctly.

### Troubleshooting

#### CSS not loading
- Verify the `base` path in `vite.config.ts` matches your repository name
- Check browser console for 404 errors
- Ensure GitHub Pages is enabled and deployed from the correct branch

#### Navigation not working
- Ensure all internal links use relative paths (no leading `/`)
- Clear browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)

#### Components not rendering
- Verify component HTML files are in `public/src/components/`
- Check that the fetch paths in `main.js` use the base URL
- Check browser console for fetch errors

### Custom Domain

If deploying to a custom domain instead of GitHub Pages:

1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: "/",  // Use root path for custom domain
     // ... other config
   })
   ```

2. Add a `CNAME` file to the `public/` folder with your domain name

3. Configure DNS settings to point to GitHub Pages

### Updating Deployment

After making changes:

1. Make your code changes
2. Commit and push to your repository
3. Run `npm run build`
4. Deploy the new `dist/` folder to GitHub Pages
5. Wait a few minutes for GitHub Pages to update

---

**Built with ❤️ for better heart health awareness**
