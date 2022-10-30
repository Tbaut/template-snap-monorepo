# Trust score snap demo 🟥 🟧 🟩 

This repository host a Snap showing a trust score for any smart contract interaction and its Dapp demo.
This snap is based on the insights api, it show in a "TRUST SCORE" tab how safe it is to interact with a contract based on quantitative data.

It currently supports:
- Contract popularity (how many tx this contract has received)
- Contract interaction (how often this account has interacted with the contract)
- Contract age (when was it deployed)
- Contract Etherscan verification

Weights are applied to the above criterias because they are not all at the same level.

![image](https://user-images.githubusercontent.com/33178835/198859158-2b659ead-4b91-49a3-a1eb-044d7990e3bf.png)

## Only works with pre-release Flask

Since the insight api is not available on the Flask in the store, you need to install the custom build [from here](https://github.com/rekmarks/metamask-extension/releases/tag/devcon-vi)

## Running

Run this Dapp demo locally with 
```
yarn && yarn start
```

Visit http://localhost:8000/ and connect your Flask to Goerli testnet. The interface allows you to interact with 2 types of contract. A very used, and old Uniswap router contract. And a new, and barely ever used Storage contract.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Releasing & Publishing

The project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

- The release version should be chosen according to SemVer. Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate SemVer version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, then ensure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

- The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release, you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action to create the release PR.

- For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value).
- This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category ([See here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories, and the correct ordering), and edit them to be more easily understood by users of the package.

- Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted. Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).
- Try to explain each change in terms that users of the package would understand (e.g. avoid referencing internal variables/concepts).
- Consolidate related changes into one change entry if it makes it easier to explain.
- Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

- If changes are made to the base branch, the release branch will need to be updated with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash & Merge the release.

- This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub.

7. Publish the release on npm.

- Be very careful to use a clean local environment to publish the release, and follow exactly the same steps used during CI.
- Use `npm publish --dry-run` to examine the release contents to ensure the correct files are included. Compare to previous releases if necessary (e.g. using `https://unpkg.com/browse/[package name]@[package version]/`).
- Once you are confident the release contents are correct, publish the release using `npm publish`.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
