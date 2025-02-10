"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplePrompt = simplePrompt;
async function simplePrompt(props) {
    return `Provide investment strategies for a user with the following crypto portfolio: ${JSON.stringify(props.portfolio)}`;
}
//# sourceMappingURL=prompts.js.map