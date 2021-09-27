-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- ROOM Table Create SQL
CREATE TABLE ROOM
(
    `no`         INT                                      NOT NULL    AUTO_INCREMENT COMMENT 'no', 
    `title`      VARCHAR(45)                              NOT NULL    COMMENT 'title', 
    `content`    VARCHAR(100)                             NULL        COMMENT '방 설명', 
    `password`   VARCHAR(45)                              NULL        COMMENT 'password', 
    `type`       ENUM("private","public","official" )    NOT NULL    COMMENT 'public: 오픈 채팅, private: 개인 채팅', 
    `createdAt`  DATETIME                                 NOT NULL    COMMENT 'createdAt', 
    `headCount`  INT                                      NOT NULL    DEFAULT 1 COMMENT '방 인원 수', 
    CONSTRAINT PK_ROOM PRIMARY KEY (no)
);

ALTER TABLE ROOM COMMENT 'ROOM';


-- USER Table Create SQL
CREATE TABLE USER
(
    `no`                  INT                                              NOT NULL    AUTO_INCREMENT COMMENT 'no', 
    `username`            VARCHAR(45)                                      NOT NULL    COMMENT 'email', 
    `name`                VARCHAR(45)                                      NOT NULL    COMMENT 'name', 
    `phoneNumber`         VARCHAR(11)                                      NOT NULL    COMMENT '핸드폰번호', 
    `password`            TEXT                                             NOT NULL    COMMENT 'password', 
    `isDeleted`           BOOLEAN                                          NOT NULL    DEFAULT false COMMENT 'false:회원  true:탈퇴', 
    `backgroundImageUrl`  TEXT                                             NOT NULL    COMMENT 'default background Image', 
    `profileImageUrl`     TEXT                                             NOT NULL    COMMENT 'default profile Image', 
    `role`                enum('ROLE_USER','ROLE_ADMIN','ROLE_UNKNOWN')    NOT NULL    COMMENT 'role', 
    `token`               TEXT                                             NULL        COMMENT 'token (만료시간까지)', 
    `createdAt`           DATETIME                                         NOT NULL    DEFAULT now() COMMENT 'createdAt', 
    `lastLoginAt`         DATETIME                                         NULL        DEFAULT now() on update now() COMMENT '마지막 로긴 시간', 
    `nickname`            VARCHAR(45)                                      NULL        COMMENT 'default=>user의 name', 
    `comments`            TEXT                                             NOT NULL    COMMENT 'default = ''covengers''', 
    CONSTRAINT PK_USER PRIMARY KEY (no)
);

ALTER TABLE USER COMMENT 'USER';


-- PARTICIPANT Table Create SQL
CREATE TABLE PARTICIPANT
(
    `no`          INT                                NOT NULL    AUTO_INCREMENT COMMENT 'no', 
    `role`        enum('ROLE_HOST','ROLE_MEMBER')    NOT NULL    COMMENT '채팅방 방장 & 멤버', 
    `status`      TINYINT                            NOT NULL    COMMENT '현재 접속 여부(1: 접속, 0: 미접속)', 
    `createdAt`   DATETIME                           NOT NULL    DEFAULT now() COMMENT 'createdAt', 
    `lastReadAt`  DATETIME                           NOT NULL    COMMENT '마지막 접속시간(채팅방 나가기 click-> update)', 
    `roomNo`      INT                                NOT NULL    COMMENT 'roomNo', 
    `userNo`      INT                                NOT NULL    COMMENT 'userNo', 
    `nickname`    VARCHAR(45)                        NULL        COMMENT 'default=>user의 nickname', 
    CONSTRAINT PK_MEMBER PRIMARY KEY (no)
);

ALTER TABLE PARTICIPANT COMMENT 'PARTICIPANT';

ALTER TABLE PARTICIPANT
    ADD CONSTRAINT FK_PARTICIPANT_roomNo_ROOM_no FOREIGN KEY (roomNo)
        REFERENCES ROOM (no) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PARTICIPANT
    ADD CONSTRAINT FK_PARTICIPANT_userNo_USER_no FOREIGN KEY (userNo)
        REFERENCES USER (no) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- FRIEND Table Create SQL
CREATE TABLE FRIEND
(
    `userNo`    INT    NOT NULL    COMMENT 'userNo', 
    `friendNo`  INT    NOT NULL    COMMENT '.', 
    CONSTRAINT PK_FRIEND PRIMARY KEY (userNo, friendNo)
);

ALTER TABLE FRIEND COMMENT 'FRIEND';

ALTER TABLE FRIEND
    ADD CONSTRAINT FK_FRIEND_friendNo_USER_no FOREIGN KEY (friendNo)
        REFERENCES USER (no) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE FRIEND
    ADD CONSTRAINT FK_FRIEND_userNo_USER_no FOREIGN KEY (userNo)
        REFERENCES USER (no) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- CHAT Table Create SQL
CREATE TABLE CHAT
(
    `no`             INT                                                  NOT NULL    AUTO_INCREMENT COMMENT 'no', 
    `roomNo`         INT                                                  NOT NULL    COMMENT 'roomNo', 
    `type`           ENUM("TEXT", "IMG","CODE", "MARKDOWN", "VIDEO" )    NOT NULL    DEFAULT 'text' COMMENT 'type', 
    `createdAt`      DATETIME                                             NOT NULL    DEFAULT now() COMMENT '메시지 발송 시간', 
    `contents`       LONGTEXT                                             NULL        COMMENT '채팅내용', 
    `notReadCount`   INT                                                  NOT NULL    COMMENT '총 안 읽은 사람 수', 
    `participantNo`  INT                                                  NULL        COMMENT 'participantNo', 
    CONSTRAINT PK_CHAT PRIMARY KEY (no)
);

ALTER TABLE CHAT COMMENT 'CHAT';

ALTER TABLE CHAT
    ADD CONSTRAINT FK_CHAT_participantNo_PARTICIPANT_no FOREIGN KEY (participantNo)
        REFERENCES PARTICIPANT (no) ON DELETE RESTRICT ON UPDATE RESTRICT;


