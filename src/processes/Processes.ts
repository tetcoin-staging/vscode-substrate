import { BehaviorSubject} from 'rxjs';
import * as vscode from 'vscode';

export type Process = {nodePath: string; term: vscode.Terminal; command: string; termCloseHandlerDispose: any;}

export default class Processes {

  processes$: BehaviorSubject<Process[]> = new BehaviorSubject([{nodePath: '', term: {} as any, command: 'substrate --dev', termCloseHandlerDispose: () => {}}] as Process[]);

  new(process: Process) {
    this.processes$.next(this.processes$.getValue().concat([process]));
    process.termCloseHandlerDispose = vscode.window.onDidCloseTerminal(t => {
      if (t === process.term) {
        process.termCloseHandlerDispose.dispose();
        console.log('Terminal closed; removing process.');
        this.del(process);
      }
    });
  }

  del(process: Process) {
    this.processes$.next(this.processes$.getValue().filter(p => p != process));
  }
}