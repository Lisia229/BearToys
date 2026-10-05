# GitHub Pages preview

In the repository's Settings > Pages, set Source to GitHub Actions.
The Deploy storefront to GitHub Pages workflow publishes pushes to main.
It can also be started manually from the Actions tab.

Preview URL: https://lisia229.github.io/BearToys/

Run `npm run build:pages` to generate static files in `out/`.
The Pages build uses `/BearToys` as its base path; the regular development
and Sites builds continue to use the root path.

This preview uses the application's demo data and client-side state.
It does not provide production authentication, payment processing, or
shared persistent inventory and orders.
