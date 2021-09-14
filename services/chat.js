const chatRepository = require('../repository/chat');

module.exports = {
    joinRoom: async (params) => {
        // variables
        const participantNo = params.participantNo;
        const roomNo = params.roomNo;
        let lastPage;
        let chatlist;

        // update status :1
        await chatRepository.updateStatus(participantNo,1);
        // update notReadCount
        await chatRepository.updateRoomNotReadCount(participantNo);

        // paging
        // get lastReadNo
        const lastReadNo = await chatRepository.getLastReadNo(participantNo);
        // get lastReadNoCount
        const lastReadNoCount = await chatRepository.getLastReadNoCount(participantNo);
        // get headCount
        const headCount = await chatRepository.getHeadCount(participantNo);
        // get chatlist count, set last page
        //쳇 리스트 갯수 구하기
        const chatListCount = await chatRepository.getChatListCount(roomNo);
        // lastPage가 -로 들어 갈때 처리 해주는 조건문
        if(chatListCount.count < process.env.CHAT_LIMIT || chatListCount >= 0){
            lastPage = 0;
        }else{
            lastPage = chaztListCount.count - process.env.CHAT_LIMIT
        }

        //get chatlist
        //  마지막 읽은 메세지가 존재 한다면  그 메시지 위치까지 페이징 시킨다 , 없다면  5개의 마지막 메시지만 보이게 한다.
        if (lastReadNoCount && lastReadNoCount.count !== 0) {
            // console.log("chatListCount.count", chatListCount.count)
            // console.log("lastReadNoCount.count", lastReadNoCount.count)
            chatlist = await chatRepository.getChatList(roomNo,chatListCount.count - lastReadNoCount.count,lastReadNoCount.count);
        } else {
            chatlist = await chatRepository.getChatList(roomNo,lastPage,process.env.CHAT_LIMIT)
        }

        // return : lastReadNo,headCount,chatListCount,chatlist
        const results = {
            lastReadNo: lastReadNo,
            lastReadNoCount: lastReadNoCount,
            headCount: headCount,
            chatListCount: chatListCount,
            lastPage: lastPage,
            chatlist: chatlist
        }
        return results;
    },
    leftRoom: async (params) => {
        const participantNo = params.participantNo;
        // set status: 0
        await chatRepository.updateStatus(participantNo,0);
        // update lastReadAt: current time
        await chatRepository.updateLastReadAt(participantNo);

        return 'leftRoom';
    }
}