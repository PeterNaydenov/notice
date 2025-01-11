export default notice;
declare function notice(): {
    on: (e: string | Symbol, fn: Function) => void;
    once: (e: string | Symbol, fn: Function) => void;
    off: (e: string | Symbol, fx?: Function) => void;
    reset: () => void;
    emit: (...args: any[]) => void;
    stop: (e: string | Symbol) => void;
    start: (e: string | Symbol) => void;
    debug: (val: boolean, header?: string) => void;
};
//# sourceMappingURL=main.d.ts.map