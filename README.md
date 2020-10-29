# Rapid Response Toolkit

**work in progress**

## Development environment

- Suggested to install [Node Version Manager](https://github.com/nvm-sh/nvm) and [RVM](https://rvm.io/)
  - `nvm use`
- `npm install` (will automatically run `bundle install` as well)
- `npm install -g gulp`
- To run a test server: `gulp serve`

## Production

The site builds automatically using Travis-CI. When changes are pushed to the `publish` branch, the site will be built and then the contents of `_site` will be pushed to the `gh-pages` branch.

Travis-CI docs for [GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages/). Personal access token with 'public_repo - Access public repositories' permissions created and used it in `travis encrypt GH_TOKEN=my_github_token --add env.matrix` as described in the [Travis-CI docs](https://docs.travis-ci.com/user/environment-variables#Encrypting-environment-variables).