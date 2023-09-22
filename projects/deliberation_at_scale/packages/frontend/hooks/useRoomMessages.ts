import { alphabetical } from "radash";

import { MessageType, RoomMessageFragment, RoomParticipantFragment, useGetRoomMessagesQuery } from "@/generated/graphql";
import useRealtimeQuery from "./useRealtimeQuery";
import { RoomId } from "@/state/slices/room";
import { getIconByMessageType } from "@/components/EntityIcons";
import { Message } from "@/flows/types";
import dayjs from "dayjs";
import { ROOM_CHAT_FLOW_BOT_NAME } from "@/utilities/constants";
import { useCallback } from "react";

export interface UseMessagesOptions {
    roomId: RoomId;
    participants: RoomParticipantFragment[] | undefined;
    userId: string;
    participantMessageHistoryAmount?: number;
    botMessageHistoryAmount?: number;
}

export default function useRoomMessages(options?: UseMessagesOptions) {
    const {
        roomId,
        participants,
        userId,
        participantMessageHistoryAmount = 1,
        botMessageHistoryAmount = 1,
    } = options ?? {};
    const insertFilter = `room_id=eq.${roomId}`;
    const { data: messagesData, loading: messagesLoading } = useRealtimeQuery(useGetRoomMessagesQuery({
        variables: {
            roomId,
            botMessageHistoryAmount,
            participantMessageHistoryAmount
        }
    }), {
        tableEventsLookup: {
            messages: {
                refetchOperations: [],
                appendOnInsertEdgePaths: ['messagesCollection', 'botMessagesCollection', 'participantMessagesCollection'],
                listenFilters: {
                    INSERT: insertFilter,
                },
            },
        },
    });
    const convertMessage = useCallback((databaseMessage: RoomMessageFragment) => {
        const { id, content, visibility_type: visibilityType, created_at: createdAt, type, participant_id: participantId } = databaseMessage ?? {};
        const isBot = (type === MessageType.Bot);
        const participant = participants?.find((participant) => participant.id === participantId);
        const nickName = isBot ? ROOM_CHAT_FLOW_BOT_NAME : (participant?.nick_name ?? 'Anonymous');
        const isCurrentParticipant = (!!userId && participant?.user_id === userId);
        const nameIcon = getIconByMessageType(type);
        const highlighted = isBot;

        // guard: skip any invalid or private messages are not meant for the current participant
        if (!!participant && visibilityType === 'private' && !isCurrentParticipant) {
            return null;
        }

        return {
            id,
            name: nickName,
            date: dayjs(createdAt).toISOString(),
            nameIcon,
            content,
            highlighted,
        } satisfies Message;
    }, [participants, userId]);
    const convertMessages = useCallback((messages: RoomMessageFragment[], types?: MessageType[]) => {
        return messages.filter((message) => !types || types.includes(message.type)).map(convertMessage).filter((message) => message !== null) as Message[];
    }, [convertMessage]);

    const databaseMessages = extractNodesFromEdges(messagesData?.messagesCollection?.edges ?? []) as RoomMessageFragment[];
    const databaseBotMessages = extractNodesFromEdges(messagesData?.botMessagesCollection?.edges ?? []) as RoomMessageFragment[];
    const databaseParticipantMessages = extractNodesFromEdges(messagesData?.participantMessagesCollection?.edges ?? []) as RoomMessageFragment[];

    const messages = orderMessages(convertMessages(databaseMessages));
    const botMessages = orderMessages(convertMessages(databaseBotMessages, [MessageType.Bot]));
    const participantMessages = orderMessages(convertMessages(databaseParticipantMessages, [MessageType.Chat, MessageType.Voice]));

    const lastBotMessages = botMessages.slice(-1 * botMessageHistoryAmount);
    const lastParticipantMessages = participantMessages.slice(-1 * participantMessageHistoryAmount);

    return {
        messages,
        messagesLoading,
        lastBotMessages,
        lastParticipantMessages,
    };
}

function extractNodesFromEdges<T extends { node: K }, K>(edges: T[] | undefined): K[] {
    return edges?.map((edge) => edge.node).filter((node) => node !== null) ?? [];
}

function orderMessages(messages: Message[]) {
    return alphabetical(
        messages,
        (message) => String(message.date) ?? '',
        "asc"
    );
}
