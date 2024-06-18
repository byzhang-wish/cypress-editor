FROM node:lts-slim
ENV TZ=Asia/Shanghai
COPY ./ /cypress-editor
WORKDIR /cypress-editor
RUN bash -c 'npm config set registry https://registry.npmmirror.com && npm install && npm run build'
CMD ["npm", "run", "start"]