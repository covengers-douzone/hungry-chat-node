-- user
select * from user;
insert into user values(-1,'unknown','unknown','01011111111','1111',0,"http://simpleicon.com/wp-content/uploads/account.png","http://simpleicon.com/wp-content/uploads/account.png",'ROLE_USER','token1111',now(),now(),'unknown','unknown');
-- insert into user values(null,'MirabelleTow@gmail.com','Mirabelle Tow','01011111111','1111',0,'/image','/image','ROLE_USER','token1111',now(),now(),'Mirabelle Tow');
-- insert into user values(null,'TownsendSeary@gmail.com','Townsend Seary','01022222222','1111',0,'/image','/image','ROLE_USER','token1111',now(),now(),'Townsend Seary');

-- room
select * from room;
insert into room values(null,'Townsend Mirabelle',null,'private', now(),2);
insert into room values(null,'3chat',null,'private', now(),3);

-- participant
select * from participant;
insert into participant values(null,'ROLE_HOST',1,now(),now(),1,1,'Mirabelle Tow');
insert into participant values(null,'ROLE_MEMBER',1,now(),now(),1,2,'Townsend Seary');
insert into participant values(null,'ROLE_HOST',1,now(),now(),2,1,'Mirabelle Tow');
insert into participant values(null,'ROLE_MEMBER',1,now(),now(),2,2,'Townsend Seary');
insert into participant values(null,'ROLE_MEMBER',1,now(),now(),2,3,'elsa');

-- chat
select * from chat;
insert into chat values(1, 1, 'text', now(), "Hey, Maher! I'm waiting for you to send me the files.",  0, 1);
insert into chat values(2, 1, 'text', now(), "I'm sorry  I'll send you as soon as possible.",  0, 2);
insert into chat values(3, 1, 'text', now(), "I'm waiting. Thank you",  0, 1);
insert into chat values(4, 1, 'text', now(), "I'm sending files now.",  0, 2);
insert into chat values(5, 1, 'text', now(), "Thank you so much. After I review these files, I will give you my opinion. If there's a problem, you can send it back. Good luck with!",  0, 1);
insert into chat values(6, 1, 'text', now(), "I can't wait",  0, 2);
insert into chat values(7, 1, 'text', now(), "I know how important this file is to you. You can trust me ;)",  0, 1);
insert into chat values(8, 1, 'text', now(), "Lorem ipsum dolor sit amet.",  1, 2);

insert into chat values(null, 2, 'text', now(), "Hey, Maher! I'm waiting for you to send me the files.",  0, 3);

-- friend
select * from friend;
insert into friend values(1,2);
insert into friend values(2,1);

insert into friend values(1,3);

select * from friend;

select *
from user u
join friend f on u.no = friendNo
where friendNo = 1
;

select *
from friend
where userNo = 2
;

select *
from friend
where friendNo = 2
;