// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// a function that returns the current selection and text in the currently active editor

function getSelection(): [vscode.TextEditor, vscode.Selection, string] | undefined {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor!');
		return;
	}
	let selection = editor.selection;
	let text = editor.document.getText(selection);
	if (!text) {
		vscode.window.showErrorMessage('No text selected!');
		return;
	}
	return [editor, selection, text];

}


export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pythonwatchhelper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pythonwatchhelper.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from PythonWatchHelper!');
	});

	context.subscriptions.push(disposable);

	// Register the new command
	let addToWatchlistDisposable = vscode.commands.registerCommand('pythonwatchhelper.addToWatchlist', async () => {
		// Get the current active text editor

		let res = getSelection();
		if (!res) {
			return;
		} else {
			// unpacking results
			var [editor, selection, text] = res;
		}

		// construct the expression we actually want to see in the watchlist
		let watchvar = `${text}_watch`
		// let watchstring = `${watchvar}=(\"${text}\", (${text}).shape,str((${text}).dtype), ${text} )`
		let watchstring = `${watchvar}=((${text}).shape,str((${text}).dtype), ${text} )`

		// replace the selected text by the watchstring
		await editor.edit((editBuilder) => {
			editBuilder.replace(selection, watchstring);
		}).then((success) => {
			// after successful replacement, evaluate the watchstring in the debug console
			vscode.commands.executeCommand('editor.debug.action.selectionToRepl');

			// get the selection again, and now replace it with the watchwar
			let res = getSelection();
			if (!res) {
				return;
			} else {
				// unpacking results
				var [editor, selection, _] = res;
			}
			editor.edit((editBuilder) => {
				editBuilder.replace(selection, `${watchvar}`);
			}).then((success) => {
				// run the action editor.debug.action.selectionToWatch to add the newly created watchwar to the watchlist
				vscode.commands.executeCommand('editor.debug.action.selectionToWatch');
				// get the selection once more and revert the change back to the original text
				let res = getSelection();
				if (!res) {
					return;
				} else {
					// unpacking results
					var [editor, selection, _] = res;
				}

				editor.edit((editBuilder) => {
					editBuilder.replace(selection, text);
				});
			});			
			

		});
	});
	
	context.subscriptions.push(addToWatchlistDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
