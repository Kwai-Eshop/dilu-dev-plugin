import type { Debuggee, Debugger_Network_requestIntercepted } from "./debuggee";
import { Debugger_Fetch_RequestPattern } from "./debuggee";
import { Intercepted, FetchIntercepted } from "./request";

export abstract class Interception {
  debuggee: Debuggee;

  protected constructor(dbg: Debuggee) {
    this.debuggee = dbg;
  }

  abstract onRequestInternal(
    listener: (req: Intercepted) => void
  ): Promise<void>;

  async onRequest(listener: (req: Intercepted) => void): Promise<void> {
    return this.onRequestInternal(listener);
  }

  abstract onResponseInternal(
    listener: (res: Intercepted) => void
  ): Promise<void>;

  async onResponse(listener: (res: Intercepted) => void): Promise<void> {
    return this.onResponseInternal(listener);
  }

  abstract captureInternal(
    pattern: Debugger_Fetch_RequestPattern[]
  ): Promise<void>;

  async capture(patterns: Debugger_Fetch_RequestPattern[]): Promise<void> {
    return this.captureInternal(patterns);
  }

  static build(dbg: Debuggee): Interception {
    return new FetchInterception(dbg);
  }
}

class FetchInterception extends Interception {
  async captureInternal(patterns: Debugger_Fetch_RequestPattern[]) {
    await this.debuggee.sendCommand("Fetch.enable", {
      patterns,
    });
  }

  async onRequestInternal(listener: (req: Intercepted) => void) {
    return this.debuggee.on("Fetch.requestPaused", (params) => {
      if (params.responseStatusCode) return;
      listener(new FetchIntercepted(this.debuggee, params));
    });
  }

  async onResponseInternal(listener: (res: Intercepted) => void) {
    return this.debuggee.on("Fetch.requestPaused", (params) => {
      if (params.responseStatusCode) {
        listener(new FetchIntercepted(this.debuggee, params));
      }
    });
  }
}
