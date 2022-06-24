// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import internal = require('stream');
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "integer-inc" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('integer-inc.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		if (!vscode) return;
		if (!vscode.window) return;

		const editor = vscode.window.activeTextEditor;
		if (!editor) return;
		const position = editor.selection.active;
		const currentLineNumber = position.line;
		const currentColumn = position.character;
		if (currentLineNumber === null || currentColumn === null) return;
		if (currentLineNumber < 1) return;

		const document = vscode.window.activeTextEditor?.document;
		if (!document) return;
		const currentLine = document.lineAt(currentLineNumber);
		if (!currentLine) return;
		const previousLine = document.lineAt(currentLineNumber - 1);
		if (!previousLine) return;

		const preInfo: [number, number, string] | null = getIntegerAt(previousLine.text, currentColumn)
		const curInfo: [number, number, string] | null = getIntegerAt(currentLine.text, currentColumn)
		if (!preInfo) return;
		if (!curInfo) return;

		const preNumber = parseInt(preInfo[2]);
		editor.edit((editBuilder) => {
			editBuilder.delete(new vscode.Range(
				new vscode.Position(currentLineNumber, curInfo[0]),
				new vscode.Position(currentLineNumber, curInfo[1])));
			editBuilder.insert(new vscode.Position(currentLineNumber, curInfo[0]),
				(preNumber + 1).toString());
		});

		if (document.lineCount > currentLineNumber - 1) {
			const nextPostion = position.with(currentLineNumber+1, currentColumn);
			editor.selection = new vscode.Selection(nextPostion, nextPostion);
		}
	});

	let getIntegerAt = function (text: string, column: number): [number, number, string] | null {
		if (!isDigit(text.charAt(column))) return null;

		const length = text.length;
		let start = column;
		while (start >= 0 && isDigit(text.charAt(start))) start--;
		start++;

		let end = column;
		while (end < length && isDigit(text.charAt(end))) end++;

		return [start, end, text.substring(start, end)];
	}
	let isDigit = function (character: string | null): boolean {
		return (character != null && character >= '0' && character <= '9')
	}
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
