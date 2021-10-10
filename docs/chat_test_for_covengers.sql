-- 넣어야 하는 데이터 : user, room, participant

-- user data
-- : spring에서 SpringApiApplication에서 맨 마지막의 주석처리된 빈을 주석 해제 후 spring 실행시키면 들어감

-- official room
insert into room values(null,'Ketchup America','Ketchup America 방',null,'official', now(),1);
insert into room values(null,'Dr.Stranger','Dr.Stranger 방',null,'official', now(),1);
insert into room values(null,'Green monster','Green monster 방',null,'official', now(),1);

-- official participant
insert into participant values (null,"ROLE_HOST",0,now(),now(),1,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),2,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),3,2,null);

-- Covengers Users dummy (!!!!!!!)
-- Spring 실행 후에 아래 쿼리 실행.
update user set profileImageUrl="http://img3.tmon.kr/cdn3/deals/2020/12/07/4912358686/4912358686_front_36d98f5996.jpg" where name="Ketchup America";
update user set profileImageUrl="https://sm.ign.com/t/ign_kr/screenshot/default/dagseu_g92p.2560.jpg" where name="Dr.Stranger";
update user set profileImageUrl="https://img.huffingtonpost.com/asset/5d7f3e61230000580554f916.jpeg?cache=vsNYzmVNEQ&ops=scalefit_630_noupscale" where name="Green monster";
update user set profileImageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXc6RCrbXnX0I1pJtWuCFkxmInSi1ViqlHzg&usqp=CAU" where name="Static electricity";