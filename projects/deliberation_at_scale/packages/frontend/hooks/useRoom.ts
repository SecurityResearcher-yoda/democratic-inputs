import { useGetRoomParticipantsQuery, useGetRoomsQuery } from "@/generated/graphql";
import useRealtimeQuery from "./useRealtimeQuery";
import { RoomId, RoomStatus } from "@/state/slices/room";
import useRoomMessages from "./useRoomMessages";
import { useAppSelector } from "@/state/store";

export interface UseRoomOptions {
  roomId: RoomId;
  roomStatus: RoomStatus;
}

export default function useRoom(options?: UseRoomOptions) {
    const currentRoomId = useAppSelector((state) => state.room.currentRoomId);
    const { roomId = currentRoomId, roomStatus } = options ?? {};
    const { data: roomData } = useRealtimeQuery(useGetRoomsQuery({
        variables: {
            roomId,
        }
    }));
    const { data: participantsData } = useRealtimeQuery(useGetRoomParticipantsQuery({
        variables: {
            roomId,
        },
    }));
    const room = roomData?.roomsCollection?.edges?.[0]?.node;
    const participants = participantsData?.participantsCollection?.edges;
    const messages = useRoomMessages({ roomId });
    const topic = room?.topics;

    return {
        id: roomId,
        status: roomStatus,
        room,
        topic,
        participants,
        ...messages,
    };
}
