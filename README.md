# Custom Spirit Django Project

Custom version of [Spirit](https://github.com/nitely/Spirit) project. 

This project assumes you had already installed these tools:

1. [Docker](https://www.docker.com/)
2. [Nodejs](https://nodejs.org/en/download/)
3. [AWS cli](https://aws.amazon.com/cli/?nc1=h_ls)
4. [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

## Development Environment

You just need to install docker and add *.env.dev* for developing the custom version of the spirit project.

Sample *.env.dev*
```
DEBUG=True
SECRET_KEY=<secret-key>
POSTGRE_NAME=<postgre-name>
POSTGRE_USER=<postgre-user>
POSTGRE_PASSWORD=<postgre-pw>
POSTGRE_HOST=<postgre-host>
POSTGRE_PORT=<postgre-port>
```

You can start the project using docker.
Below you can find the sample docker usage:

```
cd <this directory>/app
docker build -t customspiritdjango .
docker run -p 80:80 -it customspiritdjango:latest
```

After these commands you can access custom version of spirit using:
1. _http://localhost_
2. _http://127.0.0.1_

## Production Deployment

1. First you need to install and configure your [AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

2. Install [Nodejs](https://nodejs.org/tr/download/package-manager/) then by using it install [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html).

3. Add *.env.prod* to custom spirit django project. Sample one can be found below:
    ```
    DEBUG=True
    SECRET_KEY=<secret-key>
    POSTGRE_NAME=<postgre-name>
    POSTGRE_USER=<postgre-user>
    POSTGRE_PASSWORD=<postgre-pw>
    POSTGRE_HOST=<postgre-host>
    POSTGRE_PORT=<postgre-port>
    ```

4. Add *.env* to cdk folder
    ```
    CDK_DEPLOY_ACCOUNT=<aws-deployment-account-id>
    CDK_DEPLOY_REGION=<aws-deployment-account-region>
    CLIENT_NAME=<client-name-for-custom-spirit-django>
    PROJECT_ENV=<project-env>
    DOMAIN=<domain-that-you-own-and-want-to-deploy>
    ```
    
    **App folder** should be looked like this:

    ![](https://user-images.githubusercontent.com/7025275/116869409-5d099100-ac19-11eb-815d-7ccd4c800d19.png)

    **Cdk folder** should be looked like this:

    ![](https://user-images.githubusercontent.com/7025275/116869433-6d217080-ac19-11eb-9cd5-c2868d4193e2.png)

5. After you installed necessary tools and configure *.env* files you can deploy your stack by using these commands:

    ```
    cd <this-directory>/cdk
    npm i
    cdk bootstrap
    cdk synth
    cdk deploy
    ```
6. You can access your custom spirit django project from the domain you have provided.
