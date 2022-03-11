interface EmberTemplateLintOptions {
    hasResultData: true;
    workingDirectory: string;
}
interface EmberTemplateLintResults {
    files: {
        [x: string]: any;
    };
}
declare const _default: {
    new (options: EmberTemplateLintOptions): {
        defaultFileExtension: string;
        options: EmberTemplateLintOptions;
        format(results: EmberTemplateLintResults): string;
    };
};

export { _default as default };
