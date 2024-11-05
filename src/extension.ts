// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fs from 'node:fs';

export class cat implements vscode.WebviewViewProvider {
    public static readonly viewType = "ascii-cat";
    public view?: vscode.WebviewView;
    constructor(private readonly _extensionUri: vscode.Uri) { }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        this.view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        const contentUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "assets", "cat.html")
        );

        webviewView.webview.html = this.getHtmlContent(contentUri);
    }

    private getHtmlContent(contentUri: vscode.Uri): string {
        const content = fs.readFileSync(contentUri.fsPath, 'utf-8');
        return content;
    }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
let extensionContext: vscode.ExtensionContext;
let provider: cat;
let extensionUri: vscode.Uri;

export function activate(context: vscode.ExtensionContext) {
	extensionContext = context;
    provider = new cat(context.extensionUri);
    extensionUri = context.extensionUri;

	context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            cat.viewType,
            provider
        )
    );
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ascii-cat-animation" is now active!');
	context.subscriptions.push(vscode.commands.registerCommand('ascii-cat-animation.meow', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		provider.view?.webview.postMessage("meow");
		
	}));

    context.subscriptions.push(vscode.commands.registerCommand('ascii-cat-animation.sit', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		provider.view?.webview.postMessage("sit");
		
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
