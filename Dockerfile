# Node 22 이미지 사용
FROM node:22

# 앱 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 전체 복사
COPY . .

COPY certificate.crt .
COPY private.key .

# 앱 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]