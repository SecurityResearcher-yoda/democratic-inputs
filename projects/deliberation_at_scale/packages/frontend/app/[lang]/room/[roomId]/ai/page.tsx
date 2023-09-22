import useAuth from '@/hooks/useAuth';
import RoomParticipants from '@/components/RoomParticipants';
import RoomChatSummary from '@/components/RoomChatSummary';

export default async function AI() {
    await useAuth();

    return (
        <div className="h-full p-4">
            <RoomParticipants variant="spacious" />
            <RoomChatSummary />
        </div>
    );
}
