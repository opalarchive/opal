## On Running

This walkthrough uses [npm](https://www.npmjs.com/).

1. Obtain the server _.env_ file from an Opal Administrator or create your own _.env_ with values following the type ENVTemplate in `/server/src/helpers/types.ts`. Copy the _.env_ file into the server directory.
2. Run `npm i` to generate **node_modules** in **"/"**, **"/.shared"**, **"/server"**, and **"/client"**.
3. Delete all files of the of the form **"\*.js"**, **"\*.d.ts"**, or **tsconfig.tsbuildinfo**. Delete the **"/server/built-src"** directory if it exists.
4. Run `npm start` to compile typescript files to javascript files in the **.shared** and **server** directories. Alternatively you can just run `tsc` in both of them.
5. Expect several errors. They exist because the process attempts both to compile typescript into javascript and run javascript files (which do not exist at the beginning). Type **Ctrl+C/Cmd⌘+C** to abort.
6. Finally, run `npm start` again. The process should run without errors.
