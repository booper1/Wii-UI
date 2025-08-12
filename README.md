# Wii UI (Angular)

A personal project recreating the look and feel of the Nintendo Wii's system menu using Angular.  
Deployed live via GitHub Pages: **[View Live Demo](https://booper1.github.io/Wii-UI/)**

This project was originally started in React and later migrated to Angular, maintaining the same UI and functionality.

## 🚀 Development

Start a local development server:

```bash
ng serve
```

Once running, open a browser at [http://localhost:4200/](http://localhost:4200/).  
The application will auto-reload after modifying source files.

## 🌐 Deploying to GitHub Pages

This project is deployed via GitHub Pages using the `/docs` folder on the `main` branch.

### 1. Build for GitHub Pages

```bash
ng build --configuration production --base-href /Wii-UI/
```

> If using the included `publish:ghpages` script, it will also copy the build to `/docs` and create a `404.html` for SPA routing.

### 2. Commit and push

```bash
git add docs
git commit -m "Publish to GitHub Pages"
git push
```

### 3. Enable Pages

1. Go to **Settings → Pages** in the repo.
2. Set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and **Folder** to `/docs`.
4. Click **Save**.

The app will be available at:  
**https://booper1.github.io/Wii-UI/**

## 📚 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Official Docs](https://angular.dev)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
