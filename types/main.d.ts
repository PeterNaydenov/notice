declare function notice(): {
    on: (e: string | Symbol, fn: Function) => void;
    once: (e: string | Symbol, fn: Function) => void;
    off: (e: string | Symbol, fx?: Function | undefined) => void;
    reset: () => void;
    emit: (e: string | Symbol, ...args?: any[]) => void;
    stop: (e: string | Symbol) => void;
    start: (e: string | Symbol) => void;
    debug: (val: boolean, header?: string) => void;
};
export default notice;
//# sourceMappingURL=main.d.ts.map