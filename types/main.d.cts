declare function notice(): {
    on: (e: string | symbol, fn: Function) => void;
    once: (e: string | symbol, fn: Function) => void;
    off: (e: string | symbol, fx?: Function | undefined) => void;
    reset: () => void;
    emit: (e: string | symbol, ...args: any[]) => void;
    stop: (e: string | symbol) => void;
    start: (e: string | symbol) => void;
    debug: (val: boolean, header?: string) => void;
};
export = notice;
