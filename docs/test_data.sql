-- test data
desc chat;
use chat;
select * from chat;
insert into chat values(null, 7, 'TEXT', now(), '😀', 1, 5);

-- user
desc user;
select * from user;
insert into user values(null,'user1','tae','01011111111','1111',0,'/image','/image','ROLE_USER','token1111',now(),now(),'tae');
insert into user values(null,'user2','dada','01022222222','1111',0,'/image','/image','ROLE_USER','token1112',now(),now(),'dada');
insert into user values(null,'user3','we','N',now(),null,null,null,'user');
insert into user values(null,'user4','wae','N',now(),null,null,null,'user');

-- room
desc room;
select * from room;
insert into room values(null,'JavaScript',null,'public', now(),1);
insert into room values(null,'Python',null,'public', now());
insert into room values(null,'PHP',null,'public', now());
insert into room values(null,'C#',null,'public', now());
insert into room values(null,'Ruby',null,'public', now());
insert into room values(null,'Java',null,'public', now());

-- participant
desc participant;
select * from participant;
select * from participant p join user u on p.userNo = u.no;

update participant p join user u on p.userNo = u.no join room r on  p.roomNo = r.no 
set status = 'false'
where p.no > 1;

-- where u.name = 'tae' and r.title = 'JavaScript';

-- 방'JavaScript'에 host tae, member dada & we (participant no :1,2,3)
insert into participant values(null,'ROLE_HOST',1,now(),now(),1,1,'tae');     -- participant no 1
insert into participant values(null,'member','true',now(),now(),1,2);
insert into participant values(null,'member','true',now(),now(),1,3);
-- 방'Python'에 host tae, member we (participant no :4,5)
insert into participant values(null,'host','true',now(),now(),2,1);
insert into participant values(null,'member','true',now(),now(),2,3);

-- chat
desc chat;
select * from chat;

select c.no, c.createdAt, c.contents, c.read, c.participantNo, u.name from chat c 
join participant p on c.participantNo = p.no
join user u on p.userNo = u.no;

delete from chat;
insert into chat values(1, 1, 'text', now(), 'hi, I am tae',  0, 1);
insert into chat values(2, 'text', now(), 'hello~',  0, 2);

-- friend
desc friend;
select * from friend;
insert into friend values(1,2);
insert into friend values(2,1);