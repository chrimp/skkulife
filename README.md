## Flow
```mermaid
graph LR;
    LOGIN[로그인];
    USERINFO[마이페이지];
    SIGNUP[회원가입];
    NEWGROUP[그룹 추가];
    CREATEORJOIN[모임 생성/참여];
    CREATEGROUP[모임 생성]
    JOINGROUP[모임 참여];
    GROUPINFO[모임 정보 수정];
    GROUPMAIN[모임 메인화면];

    LOGIN-->USERINFO;
    LOGIN-->SIGNUP;
    SIGNUP-->LOGIN;
    USERINFO-->NEWGROUP;
    NEWGROUP-->CREATEORJOIN;
    CREATEORJOIN-->JOINGROUP;
    CREATEORJOIN-->CREATEGROUP;
    JOINGROUP-->GROUPMAIN;
    CREATEGROUP-->GROUPMAIN;
    USERINFO-->GROUPINFO;
    GROUPINFO-->REFRESH[새로고침];
    REFRESH[새로고침]-->GROUPINFO;
    INDEX["/"]-->LOGIN;
    LOGOUT[로그아웃]-->LOGIN;
```

## Tasks
- [x] 로그인
- [ ] ~~비밀번호 찾기~~
- [X] 이메일/비밀번호 불일치
- [x] 회원가입
- [x] 마이페이지 (계정 메인)
- [x] 모임 생성/참여 선택 화면
- [X] *모임 생성 화면*
- [x] 모임 참여
- [x] 모임 정보 열람
- [X] *모임 수정*
- [x] 상단 배너 (SKKULIFE)
- [x] *유저 프로필 아이콘 (메뉴 버튼)*