# AL Object Designer

C/Side Object Designer was something that the new AL development environment lacks of very much. The idea behind this extension is to provide a main hub for daily development by giving back the ability of overview.

## Main Features

* **List Overview** of all AL objects in your project: based on symbols (*.app) and your local .al files.
* **Live Update:** object list is automatically maintained as you create/change/delete objects or download symbols.
* **Multi-Folder workspaces** are supported: e.g. a workspace with MainApp/TestApp folders.
* **Object Search**: filter by Object Type, Name or ID.
* **Name filtering**: works with partial matches as well. Just like the Windows RTC Client's search field.
* **Run** selected objects.
* **Run** table/page **extentions**.
* **View definition of Symbols**: original file is opened for local files.
* **Generate new objects** from your local tables: card/list pages, report, query.
* **Built-in snippets**: generate new dictionary or entry tables using a single click.
* **Custom snippets**: use your own snippets placed in `<project root>/.altemplates` folder
* **Design view** for Pages (experimental): a simple card/list layout is rendered for local pages. 

![alt](https://github.com/martonsagi/al-object-designer/extension-al-object-designer/images/preview1.png)

## Requirements

'Run Object' function is based on commands from [CRS AL Language Extension](https://marketplace.visualstudio.com/items?itemName=waldo.crs-al-language-extension). It's made by Waldo so you should install it anyway. ;)

## Extension Settings

TODO: this is something I want for future releases. Many options are now hardcoded but should be customizable for the best experience.

## Known Issues

* Page generation works only with local table objects. You cannot generate new page from standard objects (symbols).
* View (Go to definition) is activate for all object types, however, it will not work with Control Add-ins for example. 
* It might be too bright for dark themes. 

## Preview

### Searching for "Item Ledger Entry" table
![alt](https://github.com/martonsagi/al-object-designer/extension-al-object-designer/images/preview2.png)

### Find Page "Sales Order" as a dynosaur would :)
![alt](https://github.com/martonsagi/al-object-designer/extension-al-object-designer/images/preview3.png)

### Filter to workspace and check the context menu for more options
![alt](https://github.com/martonsagi/al-object-designer/extension-al-object-designer/images/preview4.png)

## Under the hood
AL Object Designer is literally a single-page [Aurelia](https://aurelia.io/) app that is embedded into a VS Code WebView and exchanges data back and forth.

## Release Notes

### 0.0.1

Initial release.

----------------------------------------------

## For more information
[Github repo](https://github.com/martonsagi/al-object-designer): feel free to fork it or send feedback/pull requests.

**Happy AL coding!**