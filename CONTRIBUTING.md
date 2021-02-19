# How to become a contributor and submit your own code

**Table of contents**

* [Contributor License Agreements](#contributor-license-agreements)
* [Contributing a patch](#contributing-a-patch)
* [Running the tests](#running-the-tests)

## Contributor License Agreements

We'd love to accept your sample apps and patches! Before we can take them, we
have to jump a couple of legal hurdles.

Please fill out either the individual or corporate Contributor License Agreement
(CLA).

* If you are an individual writing original source code and you're sure you
  own the intellectual property, then you'll need to sign an [individual CLA](https://developers.google.com/open-source/cla/individual).
* If you work for a company that wants to allow you to contribute your work,
  then you'll need to sign a [corporate CLA](https://developers.google.com/open-source/cla/corporate).

Follow either of the two links above to access the appropriate CLA and
instructions for how to sign and return it. Once we receive it, we'll be able to
accept your pull requests.

## Contributing A Patch

1. Submit an issue describing your proposed change to the repo in question.
2. The repo owner will respond to your issue promptly.
3. If your proposed change is accepted, and you haven't already done so, sign a
   Contributor License Agreement (see details above).
4. Fork the desired repo, develop and test your code changes.
5. Ensure that your code adheres to the existing style in the code to which
   you are contributing.
6. Ensure that your code has an appropriate set of tests which all pass.
7. Title your pull request following [Conventional Commits](https://www.conventionalcommits.org/) styling.
8. Submit a pull request.

## Running the tests

1. [Prepare your environment for Node.js setup][setup].

2. Install dependencies:

        npm install

3. Run the tests:

        # Run unit tests.
        npm test

        # Run lint check.
        npm run lint

4. Lint (and maybe fix) any changes:

        npm run format

[setup]: https://cloud.google.com/nodejs/docs/setup
