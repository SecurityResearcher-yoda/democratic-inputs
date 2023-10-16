import { ModeratorTaskTuple, sendHardCodedEnrichMessage } from "../utilities/tasks";
import { BaseProgressionWorkerTaskPayload } from "../types";
import { Helpers } from "graphile-worker";
import { t } from "@lingui/macro";

export default async function enrichModeratorIntroduction(payload: BaseProgressionWorkerTaskPayload, helpers: Helpers): Promise<ModeratorTaskTuple> {
    const contentOptions = [
        t`
        Hi! My role is to moderate your conversation.
        Shall we start by taking a brief moment for introductions?
        Perhaps **introduce yourself** and why **this conversation interests you**.
        The topic will be introduced in a moment. When you are ready, you can take it from there.
        `,
    ];

    const { moderation } = await sendHardCodedEnrichMessage({
        contentOptions,
        ...payload,
        helpers
    });

    return {
        moderation,
    };
}
