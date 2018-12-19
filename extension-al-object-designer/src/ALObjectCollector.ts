import { workspace } from 'vscode';
import * as path from 'path';
import * as utils from './utils';
let firstBy = require('thenby');
let firstline = require('firstline');

export class ALObjectCollector {

    private types = [
        "Tables",
        "Pages",
        "Reports",
        "Codeunits",
        "Queries",
        "XmlPorts",
        "Profiles",
        "PageExtensions",
        "PageCustomizations",
        "TableExtensions",
        "ControlAddIns",
        "EnumTypes",
        "DotNetPackages"
    ];

    private alTypes = [
        "Table",
        "Page",
        "Report",
        "Codeunit",
        "Query",
        "XmlPort",
        "Profile",
        "PageExtension",
        "PageCustomization",
        "TableExtension",
        "ControlAddIn",
        "Enum",
        "DotNetPackage"
    ];

    public constructor() {

    }

    public async discover() {
        return await this._getData();
    }

    //#region Process files

    private async _getData() {
        let objs: Array<any> = new Array();
        let fpaths: any = (workspace as any).workspaceFolders;
        let dalFiles: Array<any> = [];

        for (let i = 0; i < fpaths.length; i++) {
            const wkspace = fpaths[i];
            let fpath: any = path.join(wkspace.uri.fsPath, '.alpackages', path.sep);
            let items: any = await utils.readDir(fpath);
            items = items.filter((f: string) => f.endsWith('.app'));

            let files = items.map((f: any) => {
                return path.join(fpath, f);
            });

            dalFiles = dalFiles.concat(files);
        }

        for (let i = 0; i < dalFiles.length; i++) {
            const element = dalFiles[i];
            
            let regex = /([aA-zZ\s]+)([0-9\.]+)(\.app)/g;
            let matches = utils.getAllMatches(regex, element);
            let matchInfo = matches[0];

            let check: any = dalFiles.filter(d => d.indexOf(matchInfo[1]) != -1);
            if (check.length > 1) {
                dalFiles.splice(i, 1);
            }
        }

        let result = await this._getWorkspaceData(dalFiles);
        objs = objs.concat(result);

        objs = await this._CheckObjectInProject(objs);
        objs = utils.uniqBy(objs, JSON.stringify);

        objs.sort(
            firstBy("TypeId")
                .thenBy("Id")
        );

        return objs;
    }

    private async _CheckObjectInProject(objs: Array<any>) {
        let result = await workspace.findFiles('**/*.al');

        if (result.length == 0) {
            return objs;
        }


        for (let i = 0; i < result.length; i++) {
            let file = result[i].fsPath;
            let line: string = await firstline(file);
            let parts = line.split(" ");

            if (parts.length > 2) {
                let objType = parts[0],
                    objId = parts[1];

                let check = objs.filter((f: any) => {
                    return f.Type.toLowerCase() == objType.toLowerCase() && f.Id == objId;
                });

                if (check.length > 0) {
                    let temp = check[0];
                    let index = objs.indexOf(temp);
                    objs.splice(index, 1);
                }

                let ucType = utils.toUpperCaseFirst(objType);
                let extendIndex = parts.indexOf('extends');
                let nameEndIndex = extendIndex != -1 ? extendIndex : parts.length;
                let name: string = parts.slice(2, nameEndIndex).join(" ").trim();
                name = utils.replaceAll(name, '"', '');
                ucType = ucType.replace('extension', 'Extension');

                let targetObj = extendIndex != -1 ? parts.slice(extendIndex + 1, parts.length).join(" ").trim() : "";
                targetObj = utils.replaceAll(targetObj, '"', '');

                let newItem = {
                    "TypeId": this.alTypes.indexOf(ucType) || "",
                    "Type": ucType || "",
                    "Id": objId || "",
                    "Name": name || "",
                    "TargetObject": targetObj || "",
                    "Publisher": "Current Project", //TODO: read app.json
                    "Application": "Current Project" || "", //TODO: read app.json
                    "Version": "0.0.0.0" || "", //TODO: read app.json
                    "CanExecute": ["Table", "Page", "PageExtension", "PageCustomization", "TableExtension", "Report"].indexOf(ucType) != -1,
                    "CanDesign": ["Page", "PageExtension"].indexOf(ucType) != -1,
                    "CanCreatePage": ['Table', 'TableExtension'].indexOf(ucType) != -1 && file != "",
                    "FsPath": file
                };

                objs.push(newItem);
            }
        }

        return objs;
    }

    private async _getWorkspaceData(items: any) {
        let objs: Array<any> = new Array();

        for (var i = 0; i < items.length; i++) {
            let filePath = items[i];

            let zip: any = await utils.readZip(filePath);
            let files = Object.keys(zip.files).filter(i => i.indexOf('.json') != -1);
            if (files.length > 0) {
                let contents: string = await zip.file(files[0]).async('string');
                let json = JSON.parse(contents.trim());

                for (let j = 0; j < this.types.length; j++) {
                    let elem: string = this.types[j];
                    let lType: string = this.alTypes[j];

                    if (json[elem]) {
                        let tempArr = json[elem].map((t: any) => {
                            return {
                                "TypeId": j || "",
                                "Type": lType || "",
                                "Id": t.Id || "",
                                "Name": t.Name || "",
                                "TargetObject": t.TargetObject || "",
                                "Publisher": json.Publisher || "Platform",
                                "Application": json.Name || "",
                                "Version": json.Version || "",
                                "CanExecute": ["Table", "Page", "PageExtension", "TableExtension", "PageCustomization", "Report"].indexOf(lType) != -1,
                                "CanDesign": false,
                                "FsPath": ""
                            };
                        });

                        objs = objs.concat(tempArr);
                    }
                }
            }
        }

        return objs;
    }

    //#endregion
}