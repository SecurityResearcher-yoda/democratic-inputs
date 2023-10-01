import { t } from "@lingui/macro";

import { ChatFlowConfig } from "./types";
import { resetQuickReply } from "./quickReplies";
import { askForEmailStep } from "./steps";
import { DEFAULT_BOT_MESSAGE_SPEED_MS } from "@/utilities/constants";

const registerFlow: ChatFlowConfig = {
    id: "register",
    userMessageTemplate: {
        name: 'You',
    },
    steps: [
        {
            name: "greeting",
            messageOptions: [[t`Hey there, welcome to Deliberation at Scale. We appreciate that you're taking the time to contribute.`]],
            timeoutMs: DEFAULT_BOT_MESSAGE_SPEED_MS,
        },
        {
            name: "get_started",
            messageOptions: [[t`To get started, we need to send you a link for you to register with.`]],
            timeoutMs: DEFAULT_BOT_MESSAGE_SPEED_MS,
        },
        askForEmailStep,
        {
            name: "thank_you",
            messageOptions: [[t`Thank you! An email has been sent with a link to register with!`]],
            quickReplies: [resetQuickReply],
        }
    ]
};

export default registerFlow;
