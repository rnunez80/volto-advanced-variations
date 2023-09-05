# volto-advanced-variations

## Develop

1. Make sure you have `docker` and `docker compose` installed and running on your machine:

    ```Bash
    git clone https://github.com/rnunez80/volto-advanced-variations.git
    cd volto-advanced-variations
    git checkout -b develop
    make
    make start
    ```

1. Wait for `Volto started at 0.0.0.0:3000` meesage

1. Go to http://localhost:3000

1.  Happy hacking!

    ```Bash
    cd src/addons/volto-advanced-variations/
    ```

### Or add volto-advanced-variations to your Volto project

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://6.docs.plone.org/volto/getting-started/install.html)

1.  Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        $ npm install -g yo
        $ npm install -g @plone/generator-volto
        $ npm install -g mrs-developer

1.  Create new volto app

        $ yo @plone/volto my-volto-project --addon volto-advanced-variations
        $ cd my-volto-project

1.  Add the following to `mrs.developer.json`:

        {
            "volto-advanced-variations": {
                "url": "https://github.com/rnunez80/volto-advanced-variations.git",
                "package": "volto-advanced-variations",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install

        $ yarn

1.  Start backend

        $ docker pull plone/plone-backend
        $ docker run -d --name plone-backend -p 8080:8080 -e SITE="Plone" -e PROFILES="plone.restapi:blocks" plone/plone-backend:6.0


    ...wait for backend to setup and start - `Ready to handle requests`:

        $ docker logs -f plone-backend

    ...you can also check http://localhost:8080/Plone

1.  Start frontend

        $ yarn start

1.  Go to http://localhost:3000

1.  Happy hacking!

        $ cd src/addons/volto-advanced-variations/
