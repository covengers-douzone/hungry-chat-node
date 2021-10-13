-- 넣어야 하는 데이터 : user, room, participant

-- user data
-- : spring에서 SpringApiApplication에서 맨 마지막의 주석처리된 빈을 주석 해제 후 spring 실행시키면 들어감

update user set profileImageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTMs7n_NkEobbt1BoS_BdwqAHjurqTtFanQ&usqp=CAU" where no=2;

-- official room
insert into room values(null,'수다','OFFICIAL',null,'official', now(),1);
insert into room values(null,'영화','OFFICIAL',null,'official', now(),1);
insert into room values(null,'음악','OFFICIAL',null,'official', now(),1);
insert into room values(null,'영상','OFFICIAL',null,'official', now(),1);
insert into room values(null,'헬스','OFFICIAL',null,'official', now(),1);
insert into room values(null,'IT','OFFICIAL',null,'official', now(),1);
insert into room values(null,'취업','OFFICIAL',null,'official', now(),1);
insert into room values(null,'여행','OFFICIAL',null,'official', now(),1);

insert into room values(null,'Ketchup America','Ketchup America 방',null,'official', now(),1);
insert into room values(null,'Dr.Stranger','Dr.Stranger 방',null,'official', now(),1);
insert into room values(null,'Green monster','Green monster 방',null,'official', now(),1);

-- official participant
insert into participant values (null,"ROLE_HOST",0,now(),now(),1,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),2,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),3,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),4,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),5,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),6,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),7,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),8,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),9,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),10,2,null);
insert into participant values (null,"ROLE_HOST",0,now(),now(),11,2,null);


-- Covengers Users dummy (!!!!!!!)
-- Spring 실행 후에 아래 쿼리 실행.
update user set profileImageUrl="https://previews.123rf.com/images/vectorchef/vectorchef1506/vectorchef150610882/41187816-%EA%B8%88%EC%9C%B5-%EC%A3%BC%EC%8B%9D-%EC%95%84%EC%9D%B4%EC%BD%98.jpg" where name="오주식";
update user set profileImageUrl="https://cdn-icons-png.flaticon.com/512/776/776924.png" where name="진사랑";
update user set profileImageUrl="https://cdn-icons-png.flaticon.com/512/2497/2497236.png" where name="우해진";
update user set profileImageUrl="https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-pencil-icon-png-image_313118.jpg" where name="배유진";
update user set profileImageUrl="https://pbs.twimg.com/profile_images/836391798666747904/WTVtG6F5.jpg" where name="강우성";
update user set profileImageUrl="http://img.danawa.com/prod_img/500000/403/723/img/6723403_1.jpg?shrink=330:330&_v=20201209154611" where name="손재현";
update user set profileImageUrl="http://img3.tmon.kr/cdn3/deals/2020/12/07/4912358686/4912358686_front_36d98f5996.jpg" where name="Ketchup America";
update user set profileImageUrl="https://sm.ign.com/t/ign_kr/screenshot/default/dagseu_g92p.2560.jpg" where name="Dr.Stranger";
update user set profileImageUrl="https://img.huffingtonpost.com/asset/5d7f3e61230000580554f916.jpeg?cache=vsNYzmVNEQ&ops=scalefit_630_noupscale" where name="Green monster";
update user set profileImageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXc6RCrbXnX0I1pJtWuCFkxmInSi1ViqlHzg&usqp=CAU" where name="Static electricity";