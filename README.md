# WiiUiAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deploying to GitHub Pages

You can deploy this project to GitHub Pages using a simple manual approach compatible with Angular 20+.

### 1. Build the project

Use the following command to build the application with a `base-href` matching your repository name. This example outputs the site to the `docs/` folder:

```bash
ng build --configuration production --output-path docs --base-href /Wii-UI/
```

### 2. Commit and push

Ensure the `docs/` folder is committed and pushed to your repository:

```bash
git add docs
git commit -m "Build for GitHub Pages"
git push
```

### 3. Enable GitHub Pages

1. Navigate to your repository on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Source**, choose:
   - **Branch**: `main`
   - **Folder**: `/docs`
4. Click **Save**.

Your site will be available at:

```
https://booper1.github.io/Wii-UI/
```

If you make further changes to the app, repeat the build and push steps to update the deployed version.
