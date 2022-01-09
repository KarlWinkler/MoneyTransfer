Drop Database if exists mt; 

CREATE DATABASE MT;

USE MT;

create table Currency(

	CurrencyId int not null auto_increment primary key,
    CurrencyName varchar(20) not null,
    FromUSD double not null
    
);

create table ACCOUNT(
	accountId int not null auto_increment,
    email varchar(30) not null,
    username varchar(20) not null,
    fName varchar(20) not null,
    lName varchar(20) not null,
    DOB date not null,
    password varchar(20) not null,
    type varchar(20) not null,
	currencyId int,
	balance int,
    
    foreign key(currencyId) references Currency(CurrencyId) ON DELETE SET NULL,
    primary key(accountId, username)
);

create table ADMIN(
	accountId int primary key,
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table USER(
	accountId int primary key,
    phoneNumber varchar(20),
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table PARTNER(
	accountId int primary key,
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);


create table PaymentMethod(

	PaymentMethodNumber varchar(20) primary key,
    PaymentMethodName varchar(20),
    accountId int,
    
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table Friend(

	accountId int Not Null,
    friendAccountd int Not Null,
    
    foreign key(accountId) references USER(accountId) ON DELETE CASCADE,
    foreign key(friendAccountd) references USER(accountId) ON DELETE CASCADE,
    
    primary key(accountId,friendAccountd)
    
);


create table USERREWARD(

	rewardId int not null auto_increment primary key,
    rewardName varchar(30) not null,
    rewardPoints int not null,
    rewardLevel int not null
    
);

create table USEREARN(
	rewardId int not null,
    userId int not  null,
    
    foreign key (userId) references USER(accountId) ON DELETE CASCADE,
    foreign key (rewardId) references userReward(rewardId) ON DELETE CASCADE,
    
    primary key(rewardId, userId)
);

create table COUNTRY(

	countryId int not null primary key auto_increment,
    countryName varchar(25) not null,
    currencyId int not null, # this must be not null
    
    foreign key (currencyId) references currency(currencyId) ON DELETE CASCADE # CASCADE
);

Create table Fee(

	FeeId int not null primary key auto_increment,
    FeeName varchar(30) not null,
    FeeRate int not null,
    countryId int,
    tarnsactionType int not null, # 1 is user and 2 is partner ... 11, 12, 21, 22
    
    foreign key (countryId) references COUNTRY(countryId) ON DELETE CASCADE
);


create table TRANSACTIONS(
	TransId int not null primary key auto_increment,
    SenderId int,
    ReceiverId int,
    Value double not null,
    CurrencyFromSender int not null,
    CurrencyToReceiver int not null,
    FeeId int,
    
    foreign key (SenderId) references Account(accountId) ON DELETE SET NULL,
    foreign key (ReceiverId) references Account(accountId) ON DELETE SET NULL,
    
    foreign key (CurrencyFromSender) references currency(currencyId) ON DELETE CASCADE,
	foreign key (CurrencyToReceiver) references currency(currencyId) ON DELETE CASCADE,
    
    foreign key (FeeId) references Fee(FeeId) ON DELETE SET NULL
);

create table LOCATION(
	LocationId int not null primary key auto_increment,
    AccountId int not null,
    phoneNo varchar(20) not null,
    city varchar(20) not null,
    countryId int not null,
    fName varchar(20) not null,
    lName varchar(20) not null,
	
    foreign key (AccountId) references PARTNER(accountId) ON DELETE CASCADE,
    foreign key (countryId) references COUNTRY(countryId) ON DELETE CASCADE
);

create table HOURS(
	LocationId int not null,
    dayOfWeek  int not null, # Monday 1
    openTime int not null,
    closeTime int not null,
    
    foreign key (LocationId) references LOCATION(LocationId) ON DELETE CASCADE,
    
    primary key(LocationId, dayOfWeek)
);

# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

# flush privileges;














