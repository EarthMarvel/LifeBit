## 서비스 소개

<img width="300" alt="이미지" src="https://github.com/EarthMarvel/LifeBit/assets/74234719/9db64cb0-2f29-4c04-9710-5828e8a6bf0e">

😊 **배포 주소 :**  [LifeBit](https://lifebit-app.com/main)
<br>

🎉 **팀 브로셔 :** [LifeBit](https://www.notion.so/teamsparta/LifeBit-810413ca2a33443f94dec5d2196e125f)
<br>

<br>
<br>

## 프로젝트 설명

- “갓생” 을 살고 싶은 사람들을 위한 서비스
- 챌린지에 참여하고, 수행한 것을 이미지로 인증할 수 있다.
- 커뮤니티를 통해 다른 사람들의 “갓생”을 공유할 수 있다.
    
- **커뮤니티**
    - 나의 갓생을 자랑하고 싶을 때, 커뮤니티를 활용하자!
<br>
<br>

## 기술 스택

**Backend**  
  ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
  ![TypeORM](https://img.shields.io/badge/-TypeORM-F37626?style=flat-square&logo=typeorm&logoColor=white)
  ![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
  ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
<br>
**DevOps**  
![AWS ECS](https://img.shields.io/badge/-AWS%20ECS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)
![Route 53](https://img.shields.io/badge/-Route%2053-232F3E?style=flat-square&logo=amazon-route53&logoColor=white)
<br>
**Database**  
![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![TypeORM](https://img.shields.io/badge/-TypeORM-F37626?style=flat-square&logo=typeorm&logoColor=white)
<br>
**Others**  
![Socket.IO](https://img.shields.io/badge/-Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white)
![AWS S3](https://img.shields.io/badge/-AWS%20S3-569A31?style=flat-square&logo=amazon-s3&logoColor=white)
![Nodemailer](https://img.shields.io/badge/-Nodemailer-009CAB?style=flat-square&logo=nodemailer&logoColor=white)
<br>
<br>
<br>


## 아키텍처
<img width="700" alt="이미지" src="https://github.com/EarthMarvel/LifeBit/assets/74234719/81b01882-90c7-44bc-ba34-d0281da3a85c">
<br>
<br>
<br>

## ERD
<img width="700" alt="이미지" src="https://github.com/EarthMarvel/LifeBit/assets/74234719/deab8e98-5a95-451e-b761-c46d8c0fb394">
<br>
<br>
<br>


## 주요 기술
| 주요 기술        | 설명                                                                                                                                                                                               |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nest.js         | Express와 다르게 구조를 가지고 있어 일관성 있고 체계적으로 코드를 구성할 수 있으며 확장과 협업에 용이함.                                                                                                 |
| TypeScript      | 강력한 타입 검사와 객체지향 기능을 제공하여 안전한 개발이 가능하고, 버그를 사전에 방지할 수 있음.                                                                                                    |
| MySQL           | 관계형 데이터베이스로 스키마에 따라 저장되어 테이블 구조가 명확하고 테이블 간의 관계를 맺을 수 있음. 널리 사용되고 있고 익숙하여 사용하기 용이함.                                                  |
| AWS S3          | 확장성과 데이터 가용성 및 보안 기능을 제공하고, 데이터베이스나 웹 서버에 저장하는 것보다 안전하게 사진 파일을 업로드하기 위해 사용됨.                                                            |
| nodemailer      | 메일 서비스 중 다운로드 수가 많고 보편적으로 사용되는 서비스이며 사용하기 쉬움.                                                                                                                   |
| Redis           | 데이터를 일회성으로 사용해야 할 때 유효시간을 설정하고 사용할 수 있는 기능을 제공함.                                                                                                               |
| social-login    | 소셜 로그인을 통해 로그인 절차를 단순화하고 편의성을 제공함.                                                                                                                                       |
| Docker          | 애플리케이션을 컨테이너로 패키징하여 환경의 일관성을 유지하고 배포가 가능하도록 함.                                                                                                                |
| Github Actions  | 지속적 통합 및 배포를 지원하여 코드의 신뢰성을 높이고 배포 플로우를 자동화함. GitHub 리포지토리와 통합하여 보다 간편하고 빠르게 배포가 가능함.                                                |
| Amazon ECS      | Docker 컨테이너를 배포하고 운영하는 데 사용되는 관리형 컨테이너 오케스트레이션 서비스로, 여러 컨테이너 관리를 위해 선택됨.                                                                       |
| Soket io        | 오래된 브라우저 및 환경에서도 호환성을 제공하고 여러 전송 옵션과 프로토콜을 지원함.                                                                                                                  |
| Google Cloud Vision API | 이미지 라벨링을 위한 API로 다양한 API 중 선택되었으며, 한국어 인식 성능이 우수하여 선택됨.                                                                                                        |

<br>
<br>
<br>

## 챌린지 기술 도전
<details>
<summary>ECS 배포</summary>

- Amazon Elastic Container Service (ECS)를 사용한 배포는 도커 컨테이너로 묶인 애플리케이션을 클러스터화하여 실행하고, 필요에 따라 자동으로 확장하거나 축소하여 유연한 운영을 지원합니다. 애플리케이션을 도커 이미지로 빌드하여 태깅하고, 이미지를 ECR에 푸시한 후 ECS 클러스터에서 실행합니다. 작업 정의와 서비스 설정을 통해 컨테이너 실행 방법을 정의하고, 필요에 따라 로드 밸런서를 구성하여 트래픽을 분산시킵니다. 배포 후 테스트를 거쳐 모니터링 및 관리를 통해 성능과 안정성을 유지합니다.

- **도커 이미지 작성:**

```Dockerfile
# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
```
- **AWS CLI를 통해 ECR에 이미지를 푸시:**
```
aws ecr get-login-password --region 리전 | docker login --username AWS --password-stdin 계정번호.dkr.ecr.리전.amazonaws.com

docker build -t 이미지명:태그 .

aws ecr create-repository --repository-name 리포지토리명 //한 번만

docker tag 이미지명:태그 계정번호.dkr.ecr.리전.amazonaws.com/리포지토리명:태그

docker push 계정번호.dkr.ecr.리전.amazonaws.com/리포지토리명:태그
```
</details>


<details>
<summary>Socket IO 좋아요 알림</summary>

- **LikeGateway 생성:**

```typescript
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LikeGateway {
  @WebSocketServer() server: Server;

  sendLikeNotification(boardId, userId) {
    this.server.emit('likeNotification', { boardId, userId });
  }
}
```

- **HTML 프론트엔드 코드:**
```
javascript
Copy code
$('#likeBtn').submit((event) => {
    event.preventDefault();
    var currentUrl = window.location.href;
    var boardId = null;
    var urlParts = currentUrl.split('/');
    var index = urlParts.indexOf('view');
    if (index !== -1 && index < urlParts.length - 1) {
      boardId = urlParts[index + 1];
    }

    document.getElementById('likeBtn').addEventListener('click', async function() {
    const response = await fetch(`/boards/${boardId}/like`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    boardId: boardId
    })
  });
});

const socket = io();

socket.on('likeNotification', function(data) {
console.log('좋아요 알림 받음:', data);
const { boardId, userId } = data;
const alertMessage = `게시물 ${boardId}에 대한 좋아요 알림: 유저${userId}님이 좋아요를 눌렀습니다.`;

// 알림을 표시할 요소를 가져옴
const notificationElement = document.getElementById('notification');
// 알림 메시지를 해당 요소의 텍스트로 설정
notificationElement.innerText = alertMessage;
// 알림을 화면에 표시
notificationElement.style.display = 'block';

// 기존에 설정된 타이머가 있다면 제거
clearTimeout(window.notificationTimer);

// 5초 후에 알림을 숨기는 타이머를 설정
window.notificationTimer = setTimeout(() => {
notificationElement.style.display = 'none';
}, 5000); // 5000밀리초 = 5초
});
});
```

- **AJAX 요청:**
```
javascript
Copy code
$.ajax({
    url: `/boards/${boardId}/like`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(),
    success: (data) => {
    //   alert('좋아요!');
      window.location.href = `/boards/view/${boardId}`;
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const errorMessage = jqXHR.responseJSON
      ? jqXHR.responseJSON.message
      : '게시물 좋아요에 실패하였습니다.';
      alert(errorMessage);
      console.log(errorMessage);
    },
  });
```
</details>


<details>
<summary>소셜 로그인(NAVER, GOOGLE, KAKAO)</summary>

- **소셜로그인 데이터 사용 권한에 대한 중요성**

소셜 로그인 사용성에 대한 접근을 할 때 특정 데이터에 대한 권한 과정이 이루어 진다. 사진에서 7번 과정은 프로필 정보를 해당 소셜 사이트에서 응답을 받게된다. 이때 설정해둔 소셜 로그인 정책에 따라 서비스에 필요한 최소한의 필요 정보만 데이터로 제공 받는다.

- **OAuth 2.0**

네이버, 카카오, 구글 등 다양한 사이트의 특정한 사용자 데이터가 접근하기 위해 우리가 만든 서비스에서 사용자의 접근 권한을 위임 받을 수 있는 표준 프로토콜이다.

- **PassPort**

인증 미들웨어를 제공하여 손쉽게 사용자를 인증할 수 있게 해주는 패키지이고 Nest.js는 PassPort를 통합하여 서비스에서 간편하게 사용할 수 있도록 지원하고 있다. OAuth 소셜 로그인 구현을 위해 서비스에서 사용할 PassPort 인증 미들웨어를 구현하는데 PassPortStrategy(PassPort 인증전략)클래스를 상속받아 구현했다.

- **NaverStrategy**

플랫폼 마다 전력파일을 만들어서 성공적으로 인증된 후 사용자 프로필을 처리하기 위한 validate메서드 구현:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'passport-jwt';
import { Strategy, Profile } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLINET_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    try {
      const { id, name, email } = profile;
      const user = {
        provider: 'naver',
        providerId: id,
        name: name,
        email: email,
      };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
}
```
</details>

<details>
<summary>CICD 파이프라인 구축</summary>

- **CICD**
Continuous Integration (CI - 지속적 통합) 은 소스 코드가 주기적으로 빌드되고 테스트되며, 공유 저장소에 통합되는 과정을 의미하며, Continuous Deployment (CD - 지속적 배포) 는 새로운 변경 사항이 통합되고 테스트를 통과한 후, 자동으로 프로덕션 환경에 배포되는 프로세스입니다. 새로운 기능이나 수정 사항이 신속하게 사용자에게 전달되고, 배포 과정에서의 오류 가능성을 줄일 수 있습니다.

- **OIDC**
OpenID Connect 의 약자로, 인증과 권한 부여를 위한 표준 프로토콜입니다. OIDC는 OAuth 2.0 프로토콜을 기반으로 하며, 인증을 위한 프레임워크로서 웹 및 모바일 애플리케이션에서 사용됩니다. Github Action으로 AWS에 배포할 때 Github Action 인스턴스 상에서 AWS 설정을 해야합니다. 이때, 필요한 권한을 받은 유저의 access key와 secret access key를 필요로 하는데, 이러한 비밀 키들은 코드 저장소에 하드 코딩되어 있거나 환경 변수로 저장되어 있으므로 노출될 수 있습니다. 반면 Github Action 패키지인 @aws-actions/configure-aws-credentials 으로 OIDC 시스템을 이용하면 안전하게 AWS 계정에 로그인할 수 있습니다.

- **자격 증명**

Deploying to Amazon Elastic Container Service 공식 문서

```yaml
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

# GitHub recommends pinning actions to a commit SHA.
# To get a newer version, you will need to update the SHA.
# You can also reference a tag or branch, but the action may change without warning.

name: Deploy to Amazon ECS

on:
  push:
    branches:
      - main

env:
  AWS_REGION: MY_AWS_REGION                   # set this to your preferred AWS region, e.g. us-west-1
  ECR_REPOSITORY: MY_ECR_REPOSITORY           # set this to your Amazon ECR repository name
  ECS_SERVICE: MY_ECS_SERVICE                 # set this to your Amazon ECS service name
  ECS_CLUSTER: MY_ECS_CLUSTER                 # set this to your Amazon ECS cluster name
  ECS_TASK_DEFINITION: MY_ECS_TASK_DEFINITION # set this to the path to your Amazon ECS task definition
                                               # file, e.g. .aws/task-definition.json
  CONTAINER_NAME: MY_CONTAINER_NAME           # set this to the name of the container in the
                                               # containerDefinitions section of your task definition

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@0e613a0980cbf65ed5b322eb7a1e075d28913a83
        with:
           role-to-assume: arn:aws:iam::{ACCOUNT ID}:role/{OIDC}
           role-session-name: sampleSessionName
           aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@62f4f872db3836360b72999f4b87f1ff13310f3a

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          # Build a docker container and
          # push it to ECR so that it can
          # be deployed to ECS.
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Fill in the new image ID in the Amazon ECS task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@c804dfbdd57f713b6c079302a4c01db7017a36fc
        with:
          task-definition: ${{ env.ECS_TASK_DEFINITION }}
          container-name: ${{ env.CONTAINER_NAME }}
          image: ${{ steps.build-image.outputs.image }}

      - name: Deploy Amazon ECS task definition
        uses: aws-actions/amazon-ecs-deploy-task-definition@df9643053eda01f169e64a0e60233aacca83799a
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```
</details>

<details>
<summary>Google Cloud Vision API</summary>

- **Label Detection**
    - Vision API는 광범위한 카테고리 그룹에서 이미지 내 항목에 대한 정보를 인식하고 추출할 수 있습니다.
    - 라벨은 일반 객체, 위치, 활동, 동물 종, 제품 등을 식별할 수 있습니다. 타겟팅 커스텀 라벨이 필요하면 Cloud AutoML Vision을 사용하여 커스텀 머신러닝 모델을 학습시켜 이미지를 분류할 수 있습니다.
    - 라벨은 영어로만 반환됩니다. Cloud Translation API를 사용하면 영어 라벨을 다양한 기타 언어로 번역할 수 있습니다.
- 특정 카테고리에 해당하는 이미지임을 증명하기 위해 라벨 분석을 진행, 이후 자체 개발 알고리즘을 통해 해당 이미지가 특정 카테고리에 해당하는 이미지인지 아닌지에 대해 인증/실패 여부 판단하여 사용자에게 반환
- Label Detection API를 통해 분석한 라벨들을 기반으로 검증 알고리즘을 통해 업로드한 이미지가 해당 미션의 카테고리와 일치하는 이미지인지 판별 후, 성공/실패 여부 반환
    - Reading 카테고리 이미지 인증 
</details>


<br>
<br>
<br>

## 팀원 소개
| 이름   | 이메일               | 깃허브                        | 담당 업무                                |
|--------|----------------------|-------------------------------|-----------------------------------------|
| 우성종 | sjwoo1999@gmail.com | [sjwoo1999](https://github.com/sjwoo1999) | - 미션 CRUD<br>- 이미지 인증 알고리즘 구현 |
| 이혜린 | hyelneu29@gmail.com | [oooo91](https://github.com/oooo91) | - 플래너 / 메인 CRUD<br>- CICD / 배포    |
| 문상웅 | tkddnd010@naver.com | [tkddnd010](https://github.com/tkddnd010) | - 회원가입(이메일 인증)/로그인<br>- 사용자 프로필 조회/수정<br>- 소셜 로그인 |
| 김민석 | alsehf0000@naver.com | [mindolle](https://github.com/mindolle) | - 커뮤니티 CRUD<br>- 게시물 검색<br>- 좋아요 알림 기능 |

