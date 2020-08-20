---
data: 2020-8-20
tag:
  - 服务器
  - nginx
author: pengpeng
location: Beijing
---

# 服务器部署文档 及ssh登录- windows 

## 服务器

centOS6.9

### 服务器操作

1. 使用工具
   Xshell 6 连接服务器，Xftp 6 本地文件上传服务器（快捷入口（标准按钮，和 Xshell 图标一起的绿色图标，点击打开 Xftp），上传文件注意当前服务器文件夹所在目录）
2. 连接服务器

### nginx

1. 安装nginx

   ```bash
   yum install nginx
   #查看版本
   nginx -v
   ```

   <div style="color:red;">安装 nginx 报错 信息: No package nginx available.</div>
   解决: 添加EPEL软件源,再安装
   操作命令步骤:

   - yum clean all
   - yum remove epel-release
   - yum update
   - yum install epel-release
   - yum install nginx -y

2. 查看nginx 安装目录

   ```bash
   rpm -ql nginx
   #文件目录
   /etc/logrotate.d/nginx
   /etc/nginx
   /etc/nginx/conf.d
   /etc/nginx/conf.d/default.conf
   /etc/nginx/fastcgi_params
   /etc/nginx/koi-utf
   /etc/nginx/koi-win
   /etc/nginx/mime.types
   /etc/nginx/modules
   /etc/nginx/nginx.conf
   /etc/nginx/scgi_params
   /etc/nginx/uwsgi_params
   /etc/nginx/win-utf
   /etc/sysconfig/nginx
   /etc/sysconfig/nginx-debug
   /usr/lib/systemd/system/nginx-debug.service
   /usr/lib/systemd/system/nginx.service
   /usr/lib64/nginx
   /usr/lib64/nginx/modules
   /usr/libexec/initscripts/legacy-actions/nginx
   /usr/libexec/initscripts/legacy-actions/nginx/check-reload
   /usr/libexec/initscripts/legacy-actions/nginx/upgrade
   /usr/sbin/nginx
   /usr/sbin/nginx-debug
   /usr/share/doc/nginx-1.16.1
   /usr/share/doc/nginx-1.16.1/COPYRIGHT
   /usr/share/man/man8/nginx.8.gz
   /usr/share/nginx
   /usr/share/nginx/html
   /usr/share/nginx/html/50x.html
   /usr/share/nginx/html/index.html
   /var/cache/nginx
   /var/log/nginx
   ```

3. nginx配置文件

   ```wiki
   /etc/nginx/conf.d/default.conf
   /etc/nginx/nginx.conf
   ```

4. 使用的基本命令
   <span style="color:red;"> nginx 启动报错:
   nginx: [emerg] socket() [::]:80 failed (97: Address family not supported by protocol) </span>

   解决:
   vim  /etc/nginx/conf.d/default.conf
   注释掉  #listen       [::]:80 default_server;


   ```bash
   #nginx 命令
   nginx  #启动服务器
   nginx -s quit #停止服务器
   nginx -s reload #重启服务器
   ps -ef | grep nginx #查询启动的nginx进程
   kill -QUIT 进程id #从容停止进程
   kill -TERM 进程id #快速停止进程
   kill -9 进程id #强制停止进程
   netstat -tunlp #产看启用端口
   fuser -n tcp 端口号  #查看端口占用
   kill -9 端口号 #结束端口占用
   
   #文件查看编辑
   tail -f access.log # 服务器查看访问日志
   cd /   #直接到顶层 / 目录下
   cd ..  #返回上一层目录
   cd 文件夹名称 #进入到文件夹名目录下
   rm -rf 文件夹
   rm -f 文件
   ls     #查看当前目录下的所有文件，文件夹
   cat 文件名 #查看文件内容
   sudo su - #切换 root账户
   # Permission denied 没权限
   ls -l #查看当前目录下文件的权限
   chown -R admin  /usr/local/soft/ #修改文件夹拥有组为admin（xftp传输文件报错问题）
   
   vim 文件名 #编辑文件
   #进入编辑模式
   #按 i 开始编辑，上下左右减调整指针位置，
   #按 esc 退出编辑模式
   #输入 :q 不保存退出 :wq 保存退出
   ```

### ssh服务器登录

```bash
1.使用xshell在本地生成秘钥
    id_rsa	私钥
    id_rsa.pub  公钥
2.服务器sshd配置文件 /etc/ssh/sshd_config
3.配置选项(一般为去掉注释)
    # 将以下这项去掉注释并改为yes，以启用密钥验证
    PubkeyAuthentication yes
	# 指定公钥数据库文件
	AuthorsizedKeysFile .ssh/authorized_keys
4.在服务器~/下创建 .ssh文件夹
	直接打开xftp 创建
5.将本地的公钥复制到服务器.ssh目录下并且改名为 authorized_keys
	本地文件目录 C:\Users\Admin\.ssh
6.重启ssh
	#ubuntu系统
    service ssh restart

    #debian系统
    /etc/init.d/ssh restart

    # CentOS 使用以下命令
    systemctl restart sshd.service
        # systemctl: command not found
        # 使用
        service sshd restart

7.使用ssh登录
```

### 访问报错

1. 403 Forbidden错误记录

```
先检查当前访问服务器静态资源路径下,有没有相应的静态文件,静态文件目录(usr/share/nginx/html)
```

