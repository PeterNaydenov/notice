export default notice;
declare function notice(): {
    on: (e: string, fn: Function) => void;
    once: (e: string, fn: Function) => void;
    off: (e: string, fx?: Function) => void;
    reset: () => void;
    emit: (...args: any[]) => void;
    stop: (e: string) => void;
    start: (e: string) => void;
    debug: (val: boolean, header?: string) => void;
};
//# sourceMappingURL=main.d.ts.map