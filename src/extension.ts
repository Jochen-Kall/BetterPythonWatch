// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Retrieves the active text editor, selection, and selected text.
 * @returns An array containing the active text editor, selection, and selected text, or undefined if there is no active editor or no text selected.
 */
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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Register the custom add to watchlist command
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
