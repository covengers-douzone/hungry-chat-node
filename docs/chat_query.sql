select * from user;
select * from participant;
select * from chat;

-- get room list 
select *
from room r
join participant p on r.no = p.roomNo
where p.userNo = 1
;

select *
from participant p
join room r on r.no = p.roomNo
join user u on u.no = p.userNo
where u.no = 1
;

SELECT * FROM participant A , User B
WHERE 1 = 1
AND A.roomNo = 1
AND A.userNo = B.no
;

-- chat list
select * -- p.nickname, p.roomNo, c.notReadCount, c.contents
from participant p 
join chat c on p.no = c.participantNo
where p.roomNo = 1
;

-- not read count
select *
from participant p 
join chat c on p.no = c.participantNo
where date_format(p.lastReadAt, '%Y-%m-%d %H:%i:%s') < date_format(c.createdAt,  '%Y-%m-%d %H:%i:%s')
;

select *
from participant
where no = 1
;

-- update room
select *
from chat c
join participant p  -- on p.no = c.participantNo
join room r on r.no = c.roomNo
where p.lastReadAt < c.createdAt
and p.no = 2
; 

delete from chat;
select * from chat;
select * from participant;
select * from room;

UPDATE chat c
 INNER JOIN participant p
    ON c.roomNo = p.roomNo
   SET c.notReadCount =  c.notReadCount - 1
   where p.lastReadAt < c.createdAt
   AND p.no = 2
   ;

-- update status
update participant set status = 0 where no = 7;

-- find friend list
select *
from friend f
join user u on f.friendNo = u.no
where userNo = 1
;

-- 
select * from chat;
update chat set notReadCount = notReadCount -1 where no = 93;
update chat set notReadCount = 3;

-- get headCount
select * 
from room r
join participant p
on r.no = p.roomNo
where r.no = 1
;

-- status
select * from participant;
select * from room;
select * from chat;

-- room info
select *
from room r
join participant p on r.no = p.roomNo
where r.no = 1
;

SELECT * -- max(B.no) 
FROM participant A , Chat B
WHERE 1 = 1
AND A.no = 2 -- B.participantNo =  2
AND A.roomNo = B.roomNo
AND B.createdAt < A.LastReadAt
;

select *
from participant
;

select * from room;
desc room;
insert into room values(null,'official room','관리자가 만든 방',null,'official', now(),1);
insert into room values(null,'official room2','관리자가 만든 방2',null,'official', now(),1);
insert into room values(null,'official room3','관리자가 만든 방3',null,'official', now(),1);

-- ghost
select * 
from room r
join participant p on r.no = p.roomNo
where p.userNo = 1
and r.no = 73
; 

-- image list in room
