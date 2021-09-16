-- 넣어야 하는 데이터 : user, room, participant

-- user data
-- : spring에서 SpringApiApplication에서 맨 마지막의 주석처리된 빈을 주석 해제 후 spring 실행시키면 들어감

-- official room
insert into room values(null,'official room1','관리자가 만든 방',null,'official', now(),1);
insert into room values(null,'official room2','관리자가 만든 방2',null,'official', now(),1);
insert into room values(null,'official room3','관리자가 만든 방3',null,'official', now(),1);

-- official participant
insert into participant values (null,"ROLE_HOST",0,now(),now(),1,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),2,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),3,2,null);